
export const getDocs = (req, res) => {
res.status(200).json({
    success: true,
    message: 'Docs retrieved successfully',
    docs: {
        auth: {
            '/api/auth/send-otp': {
                description: 'Send OTP to the user',
                method: 'POST',
                body: {
                    required: {
                        email: 'string',
                    },
                    optional: {}
                }
            },
            '/api/auth/register': {
                description: 'Register a new user',
                method: 'POST',
                body: {
                    required: {
                        email: 'string',
                        otp: 'string',
                        username: 'string',
                        password: 'string',
                        confirm_password: 'string'
                    },
                    optional: {}
                }
            },
            '/api/auth/login': {
                description: 'Login to the application',
                method: 'POST',
                body: {
                    required: {
                        email: 'string',
                        password: 'string'
                    },
                    optional: {}
                }
            },
            '/api/auth/reset-password': {
                description: 'Reset user password',
                method: 'POST',
                body: {
                    required: {
                        email: 'string',
                        otp: 'string',
                        old_password: 'string',
                        password: 'string',
                        confirm_password: 'string'
                    },
                    optional: {}
                }
            },
            '/api/auth/logout': {
                description: 'Logout from the application',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {}
            },
            '/api/auth/refresh-token': {
                description: 'Refresh user access token',
                method: 'POST',
                body: {
                    required: {
                        refreshToken: 'string'
                    },
                    optional: {}
                }
            },
            '/api/auth/user': {
                description: 'Get user details',
                method: 'GET',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {}
            }
        },
        team: {
            '/api/team': {
                description: 'Get all teams',
                method: 'GET',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {}
            },
            '/api/team/:id': {
                description: 'Get a team by id',
                method: 'GET',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {}
            },
            '/api/team': {
                description: 'Create a new team',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        title: 'string',
                        description: 'string'
                    },
                    optional: {}
                }
            },
            '/api/team/:id/member': {
                description: 'Add a member to the team',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        email: 'string'
                    },
                    optional: {}
                }
            }
        },
        client: {
            '/api/client': {
                description: 'Create a new client',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        team: 'team id',
                        fullName: 'string',
                        phone: 'string'
                    },
                    optional: {
                        email: 'string',
                        businessName: 'string',
                        merchantHistory: 'string',
                        deposit: 'number',
                        lookingFor: 'string',
                        creditScore: 'number',
                        existingLoan: 'string',
                        note: 'string'
                    }
                }
            },
            '/api/client/:id': {
                description: 'Update client',
                method: 'PUT',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {},
                    optional: {
                        fullName: 'string',
                        email: 'string',
                        businessName: 'string',
                        merchantHistory: 'string',
                        deposit: 'number',
                        lookingFor: 'string',
                        creditScore: 'number',
                        existingLoan: 'string',
                        note: 'string'
                    }
                }
            },
            '/api/client/': {
                description: 'Get clients by team and phone',
                method: 'GET',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {
                    required: {
                        team: 'team id'
                    },
                    optional: {
                        phone: 'string'
                    }
                }
            },
            '/api/client/:id/comment': {
                description: 'Add a comment to the client',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        comment: 'string',
                    },
                    optional: {}
                }
            },
            '/api/client/:id/comment/:commentId': {
                description: 'Update a comment to the client',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        comment: 'string',
                    },
                    optional: {}
                }
            }
        },
        lead: {
            '/api/lead/:id': {
                description: 'Get a lead by id',
                method: 'GET',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {}
            },
            '/api/lead/team/:id': {
                description: 'Get all leads by team id',
                method: 'GET',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                queries: {
                    required: {},
                    optional: {
                        limit: 'number',
                        page: 'number',
                        clientPhone: 'string',
                        fromDate: 'date',
                        toDate: 'date',
                        status: 'string',
                        currentOwner: 'boolean',
                        subOwner: 'boolean',
                        createdBy: 'boolean'
                    }
                }
            },
            '/api/lead': {
                description: 'Create a new lead',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        team: 'team id',
                        client: 'client id',
                    },
                    optional: {}
                }
            },
            '/api/lead/:id': {
                description: 'Update a lead',
                method: 'PUT',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {},
                    optional: {
                        status: 'string',
                        followupAt: 'date',
                        closingNote: 'string'
                    }
                }
            },
            '/api/lead/:id/comment': {
                description: 'Add a comment to the lead',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        comment: 'string'
                    },
                    optional: {}
                }
            },
            '/api/lead/:id/current-owner': {
                description: 'Update Current Owner of the lead',
                method: 'POST',
                headers: {
                    required: {
                        Authorization: 'Bearer Token'
                    }
                },
                body: {
                    required: {
                        email: 'string'
                    },
                    optional: {}
                }
            }
        }
    }
});
}