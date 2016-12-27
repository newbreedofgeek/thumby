import { InvalidRequest } from '../../src/errors';

describe('InvalidRequest', () => {
  let error = null;

  beforeEach(() => {
    error = new InvalidRequest('File messed up');
  });

  describe('constructor', () => {
    it('should setup required props', () => {
      expect(error.message).to.equal('File messed up');
      expect(error.name).to.equal('InvalidRequest');
    });
  });

  describe('throwability and Error type checks', () => {
    const doSomthing = () => {
      throw error;
    };

    it('should throw', () => {
      let errorCaught = null;

      try {
        doSomthing();
      } catch (e) {
        errorCaught = e;
      } finally {
        expect(errorCaught).not.be.null;
      }
    });

    it('should throw as Error', () => {
      let errorCaught = null;

      try {
        doSomthing();
      } catch (e) {
        errorCaught = e;
      } finally {
        expect(errorCaught instanceof Error).to.be.true;
      }
    });

    it('should be the correct Error type name', () => {
      let errorCaught = null;

      try {
        doSomthing();
      } catch (e) {
        errorCaught = e;
      } finally {
        expect(errorCaught.name).to.be.equal('InvalidRequest');
      }
    });
  });
});
