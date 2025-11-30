import mongoose from 'mongoose';
import Lead from '../models/lead.js';
import User from '../models/user.js';
import Client from '../models/client.js';

class LeadRepository {
    async getLeadsByProperty({property, limit, page}) {
        try {
            limit = limit || 0;
            page = page ? (page <= 0 ? 1 : page) : 1;
            const skip = (page - 1) * limit;
            
            // Get collection names dynamically (fallback to default Mongoose pluralization)
            // Mongoose automatically pluralizes model names: User -> users, Client -> clients
            let usersCollection = 'users';
            let clientsCollection = 'clients';
            
            try {
                if (User.collection && User.collection.name) {
                    usersCollection = User.collection.name;
                }
                if (Client.collection && Client.collection.name) {
                    clientsCollection = Client.collection.name;
                }
            } catch (e) {
                // Use defaults if collection not available
                console.warn('Could not get collection names, using defaults:', e.message);
            }
            
            // Convert string IDs to ObjectIds in property for proper matching
            const matchProperty = { ...property };
            if (matchProperty.team && typeof matchProperty.team === 'string') {
                matchProperty.team = new mongoose.Types.ObjectId(matchProperty.team);
            }
            if (matchProperty.currentOwner && typeof matchProperty.currentOwner === 'string') {
                matchProperty.currentOwner = new mongoose.Types.ObjectId(matchProperty.currentOwner);
            }
            if (matchProperty.createdBy && typeof matchProperty.createdBy === 'string') {
                matchProperty.createdBy = new mongoose.Types.ObjectId(matchProperty.createdBy);
            }
            if (matchProperty.subOwners && matchProperty.subOwners.$in) {
                matchProperty.subOwners.$in = matchProperty.subOwners.$in.map(id => 
                    typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
                );
            }
            
            // Build aggregation pipeline for advanced sorting
        const pipeline = [
            // Match leads based on property filters
            { $match: matchProperty },
            
            // Add computed fields for sorting
            {
                $addFields: {
                    // Status priority: CallbackRequested=1, Followup=2, Processing=3, SaleMade=4, DeclinedSale=5
                    statusPriority: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$status', 'CallbackRequested'] }, then: 1 },
                                { case: { $eq: ['$status', 'Followup'] }, then: 2 },
                                { case: { $eq: ['$status', 'Processing'] }, then: 3 },
                                { case: { $eq: ['$status', 'SaleMade'] }, then: 4 },
                                { case: { $eq: ['$status', 'DeclinedSale'] }, then: 5 }
                            ],
                            default: 6
                        }
                    },
                    // Follow-up urgency: overdue=0, upcoming=1, none=2
                    // Using $$NOW system variable for current date comparison
                    followupUrgency: {
                        $cond: {
                            if: { $ifNull: ['$followupAt', false] },
                            then: {
                                $cond: {
                                    if: { $lt: ['$followupAt', '$$NOW'] },
                                    then: 0, // Overdue
                                    else: 1  // Upcoming
                                }
                            },
                            else: 2 // No followup date
                        }
                    },
                    // Normalized followup date for sorting (use far future for no date)
                    followupSortDate: {
                        $cond: {
                            if: { $ifNull: ['$followupAt', false] },
                            then: '$followupAt',
                            else: new Date('2099-12-31T23:59:59.999Z') // Far future for sorting
                        }
                    },
                    // Most recent comment date (if exists)
                    lastCommentDate: {
                        $cond: {
                            if: { $gt: [{ $size: { $ifNull: ['$comments', []] } }, 0] },
                            then: { $max: '$comments.createdAt' },
                            else: null
                        }
                    },
                    // Activity date: use updatedAt or last comment date, whichever is more recent
                    activityDate: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ['$lastCommentDate', null] },
                                    { $ne: ['$updatedAt', null] },
                                    { $gt: ['$lastCommentDate', '$updatedAt'] }
                                ]
                            },
                            then: '$lastCommentDate',
                            else: {
                                $cond: {
                                    if: { $ne: ['$updatedAt', null] },
                                    then: '$updatedAt',
                                    else: { $ifNull: ['$lastCommentDate', '$createdAt'] }
                                }
                            }
                        }
                    }
                }
            },
            
            // Sort by: statusPriority, followupUrgency, followupSortDate, activityDate, createdAt
            {
                $sort: {
                    statusPriority: 1,        // Lower priority number = higher priority
                    followupUrgency: 1,       // Overdue first (0), then upcoming (1), then none (2)
                    followupSortDate: 1,      // Earlier dates first (ascending)
                    activityDate: -1,         // Most recent activity first
                    createdAt: -1             // Newest first as tie-breaker
                }
            },
            
            // Populate client
            {
                $lookup: {
                    from: clientsCollection,
                    localField: 'client',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $unwind: {
                    path: '$client',
                    preserveNullAndEmptyArrays: true
                }
            },
            
            // Populate currentOwner
            {
                $lookup: {
                    from: usersCollection,
                    localField: 'currentOwner',
                    foreignField: '_id',
                    as: 'currentOwner'
                }
            },
            {
                $unwind: {
                    path: '$currentOwner',
                    preserveNullAndEmptyArrays: true
                }
            },
            
            // Populate subOwners
            {
                $lookup: {
                    from: usersCollection,
                    localField: 'subOwners',
                    foreignField: '_id',
                    as: 'subOwners'
                }
            },
            
            // Populate createdBy
            {
                $lookup: {
                    from: usersCollection,
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            
            // Remove computed sorting fields from output
            {
                $project: {
                    statusPriority: 0,
                    followupUrgency: 0,
                    followupSortDate: 0,
                    lastCommentDate: 0,
                    activityDate: 0
                }
            },
            
            // Apply pagination
            ...(skip > 0 ? [{ $skip: skip }] : []),
            ...(limit > 0 ? [{ $limit: limit }] : [])
        ];
        
            // Execute aggregation
            console.log('Executing aggregation with property:', matchProperty);
            console.log('Collection names - users:', usersCollection, 'clients:', clientsCollection);
            const leads = await Lead.aggregate(pipeline);
            console.log(`Aggregation returned ${leads.length} leads`);
            
            return leads;
        } catch (error) {
            console.error('Error in getLeadsByProperty:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    async createLead(lead) {
        return await Lead.create(lead);
    }
    async getLeadById(id) {
        return await Lead.findById(id).populate('client');
    }

    async updateLeadById(id, lead) {
        return await Lead.findByIdAndUpdate(id, lead, {new: true});
    }

    async addComment(leadId, comment) {
        return await Lead.findByIdAndUpdate(
            leadId,
            { $push: { comments: comment } },
            { new: true }
        );
    }

    async updateCurrentOwner(leadId, memberId) {
        await Lead.findByIdAndUpdate(leadId, { currentOwner: memberId });
        return await Lead.findByIdAndUpdate(
            leadId,
            { $addToSet: { subOwners: memberId } },
            { new: true }
        );
    }
}

export default new LeadRepository();