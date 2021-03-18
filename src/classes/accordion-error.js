class AccordionError extends Error {
  constructor(code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AccordionError);
    }
    this.code = code;
    this.message = params[0];
  }
}

module.exports = AccordionError;