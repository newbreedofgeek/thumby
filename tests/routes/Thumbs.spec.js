import { Thumbs } from '../../src/routes/';

describe('Thumbs', () => {
  let status = null;
  const mockReq = {};
  const mockRes = {
    json: sinon.spy()
  };

  beforeEach(() => {
    status = new Thumbs();
  });

  it('should return route', () => {
    status.route(mockReq, mockRes);

    expect(mockRes.json).to.be.calledWith({
      status: 'root'
    });
  });
});
