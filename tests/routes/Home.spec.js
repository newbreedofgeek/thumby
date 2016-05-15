import { Home } from '../../src/routes/';

describe('Home', () => {
  let status = null;
  const mockReq = {};
  const mockRes = {
    json: sinon.spy()
  };

  beforeEach(() => {
    status = new Home();
  });

  it('should return route', () => {
    status.route(mockReq, mockRes);

    expect(mockRes.json).to.be.calledWith({
      ok: 1,
      msg: 'Welcome to thumby'
    });
  });
});
