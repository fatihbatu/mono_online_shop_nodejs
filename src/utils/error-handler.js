const { createLogger, transports } = require('winston');
const {
  AppError,
  APIError,
  ConflictError,
  BadRequestError,
  ValidationError,
} = require('./app-errors');

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app_error.log' }),
  ],
});

class ErrorLogger {
  constructor() {}
  async logError(err) {
    console.log('==================== Start Error Logger ===============');
    LogErrors.log({
      private: true,
      level: 'error',
      message: `${new Date()}-${JSON.stringify(err, null, 2)}`,
    });
    console.log('==================== End Error Logger ===============');
    return false;
  }

  isTrustError(err) {
    if (
      err instanceof AppError ||
      err instanceof APIError ||
      err instanceof ConflictError ||
      err instanceof BadRequestError ||
      err instanceof ValidationError
    ) {
      return err.isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLogger();

  process.on('uncaughtException', (err) => {
    errorLogger.logError('uncaughtException: ', err);
    if (!errorLogger.isTrustError(err)) {
      process.exit(1);
    }
  });

  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDescription });
      }
      return res
        .status(err.statusCode)
        .json({ message: err.name || 'Something went wrong' });
    }
    return res.status(err.statusCode).json({ message: err.message });
  }
  next();
};

module.exports = ErrorHandler;
