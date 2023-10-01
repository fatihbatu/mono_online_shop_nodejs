const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 403, // Corrected spelling from UN_AUTHORISED to UNAUTHORIZED
  NOT_FOUND: 404,
  CONFLICT: 409, // Add this line
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  constructor(
    name,
    statusCode,
    description,
    isOperational = true,
    errorStack,
    loggingErrorResponse
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.loggingErrorResponse = loggingErrorResponse;
    Error.captureStackTrace(this);
  }
}

// API Specific Errors
class APIError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = 'Internal Server Error',
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

// 400
class BadRequestError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.BAD_REQUEST,
    description = 'Bad Request',
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

// 400
class ValidationError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY,
    description = 'Validation Error',
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class ConflictError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.CONFLICT,
    description = 'Validation Error',
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class NotFoundError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.NOT_FOUND,
    description = 'Not Found',
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

module.exports = {
  AppError,
  APIError,
  BadRequestError,
  ValidationError,
  ConflictError,
  NotFoundError,
  STATUS_CODES,
};
