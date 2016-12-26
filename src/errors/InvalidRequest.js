class InvalidRequest extends Error {
  constructor(message) {
    super(message);

    this.message = message;
    this.name = 'InvalidRequest';
  }
}

export default InvalidRequest;
