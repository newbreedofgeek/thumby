class FileUploadError extends Error {
  constructor(message) {
    super(message);

    this.message = message;
    this.name = 'FileUploadError';
  }
}

export default FileUploadError;
