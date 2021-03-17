function notFound(req, res, next){
    res.status(404);
    const error = new Error(`page not found: ${req.url}`);
    next(error);
}

function errorHandler(err, req, res, next){
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : '🍰'
    });
}


module.exports = {
    notFound,
    errorHandler
}