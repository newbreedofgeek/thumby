import { Home, Thumbs } from './routes/';

exports.connect = (app) => {
  // Routes initialize
  const home = new Home();
  const thumbs = new Thumbs();

  app.get('/', home.route);
  // app.get('/thumbs', thumbs.route);
  app.post('/thumbs/create', thumbs.create);
};
