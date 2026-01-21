
const globalErrorHandler = (err, req, res, next) => {

    res.status(err.status || 500)
        .json({ error: err.errors || "Error" });
}

export default globalErrorHandler;