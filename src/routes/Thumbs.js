import fs from 'fs-extra';
import lwip from 'lwip';
import cfg from '../config';
import path from 'path';
import Promise from 'bluebird';

class Thumbs {
  constructor() {
    this.create = this.create.bind(this);
  }

  createThumbs(orientation, image, filename) {
    return new Promise((resolve, reject) => {
      image.clone((e2, clone1) => {
        if (e2) reject(e2);

        clone1.batch()
        .scale(parseInt(cfg.thumbs.landscape.lrgWidth, 10) / image.width())
        .writeFile(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/thumbs/lrg/', filename), (e3) => {
          if (e2) reject(e3);

          image.clone((e4, clone2) => {
            if (e4) reject(e4);

            clone2.batch()
            .scale(parseInt(cfg.thumbs.landscape.medWidth, 10) / image.width())
            .writeFile(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/thumbs/med/', filename), (e5) => {
              if (e5) reject(e5);

              image.clone((e6, clone3) => {
                if (e6) reject(e6);

                clone3.batch()
                .scale(parseInt(cfg.thumbs.landscape.smlWidth, 10) / image.width())
                .writeFile(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/thumbs/sml/', filename), (e7) => {
                  if (e7) reject(e7);

                  resolve();
                });
              });
            });
          });
        });
      });
    });
  }

  create(req, res) {
      req.busboy.on('file', (fieldname, file, fn) => {
        const filename = `${new Date().getTime().toString()}_${fn}`;

        // Path where image will be uploaded
        const fstream = fs.createWriteStream(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/originals/', filename));
        file.pipe(fstream);

        fstream.on('close', () => {
          console.log(`Thumbs > raw file upload finished for: ${filename}`);

          lwip.open(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/originals/', filename), (e1, image) => {

            if (!e1) {
              console.log(`Thumbs > open and make thumbs for: ${filename} original rez is width ${image.width()} height = ${image.height()}`);

              this.createThumbs('', image, filename).then(() => {
                res.json({
                  ok: '1',
                  filename
                });
              }).catch((e) => {
                res.json({
                  ok: '0',
                  error: e
                });
              });
            }
            else {
              console.warn(`Thumbs > Error the raw file for: ' ${filename}`);
            }
          });
        });
      });

      req.pipe(req.busboy);
  }
}

export default Thumbs;
