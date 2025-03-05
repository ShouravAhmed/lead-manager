const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route Not Found - ${req.originalUrl}`);
    next(error);
  }
  
  export default notFoundHandler;