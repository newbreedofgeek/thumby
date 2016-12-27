class FileUploadIssue extends Error {
  constructor(message) {
    super(message);

    this.message = message;
    this.name = 'FileUploadIssue';
  }
}

export default FileUploadIssue;
