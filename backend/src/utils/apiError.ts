// Instead of error we will perform throw new ApiErros and have a custom error class with all the required properties

class ApiErrors extends Error {
  status: number;
  errors?: string[];
  success?: boolean;
  constructor(status: number, message: string, errors = [], stack = "") {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiErrors };
