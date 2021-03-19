module.exports = class CodedError extends Error {
  constructor(code, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodedError);
    }
    this.code = code;
  }
};