import { Thumbs } from '../../src/routes/';

describe('Thumbs', () => {
  let thumbs = null;

  beforeEach(() => {
    thumbs = new Thumbs();
  });

  describe('constructor', () => {
    it('should setup required props', () => {
      expect(thumbs.image).to.exist;
      expect(thumbs.fname).to.exist;
      expect(thumbs.originalImgLoc).to.exist;
      expect(thumbs.create).to.exist;
    });
  });

  describe('catchHandler', () => {
    const mockRes = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    const remoteLog = () => {};

    const InvalidRequest = require('../../src/errors').InvalidRequest;

    beforeEach(() => {
      thumbs.res = mockRes;

      try {
        thumbs.catchHandler(new InvalidRequest('weird error'), 'its super weird');
      } catch (e) {
        remoteLog(e);
      } finally {
        // clean up
      }
    });

    it('should throw the error', () => {
      expect(() => {
        thumbs.catchHandler(new InvalidRequest('weird error'), 'its super weird');
      }).to.throw(Error);
    });

    it('should return a 400 response', () => {
      expect(mockRes.status).to.be.calledWith(400);
    });

    it('should return a friendly json error response', () => {
      expect(mockRes.json).to.be.calledWith({
        success: false,
        error: {
          code: 'InvalidRequest',
          message: 'weird error',
          detail: 'its super weird'
        }
      });
    });
  });
});
