import express from 'express';
import http from 'http';
import domain from 'domain';
import bodyParser from 'body-parser';
import router from './router';
import cfg from './config';
import busboy from 'connect-busboy';
import cors from 'cors';
import path from 'path';

// Default max connections in node is 5, expanding to 2000
http.globalAgent.maxSockets = 2000;

// Set up Express
const app = module.exports = express();

// Use domains to capture the errors at the request scope, and not crash the server
app.use((req, res, next) => {
  const d = domain.create();
  d.add(req);
  d.add(res);
  d.on('error', next);
  d.run(next);
});

app.use(cors());
app.use(busboy());
app.use(express.static(path.join(__dirname, '../public'), { maxAge: ((cfg.imgCache) ? cfg.imgCache : 0)})); // if images are stored locally in the public directory
app.use(express.static(path.join(__dirname, '../storage'), { maxAge: ((cfg.imgCache) ? cfg.imgCache : 0)})); // if images are mounted (to a dir named storage) - usueful if we run thumby inside a docker container and need persistant storage

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load clients into the app
router.connect(app);

app.set('port', process.env.PORT || cfg.port);
