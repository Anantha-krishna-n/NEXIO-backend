"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.log(err);
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
