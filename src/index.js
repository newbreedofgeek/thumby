import http from 'http';
import app from './app';
import cfg from './config';

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')} - ${cfg.env} mode`);
  console.log(`Process ID: ${process.pid}`);
});
