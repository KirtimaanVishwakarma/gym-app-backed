class ApiError extends Error {
  constructor( //whoever called this need to pass this to the constructor
    statusCode = 500,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message); //super what we want to overwrite
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if(stack){
        this.stack = stack;
    }else{
        Error.captureStackTrace(this, this.constructor); //this will add the stack trace of the error
    }
  }
}

export default ApiError;