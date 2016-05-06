import { inspect } from 'util';
import fs from 'fs-extra';
import lwip from 'lwip';
import cfg from '../config';
import path from 'path';

class Thumbs {
  route(req, res) {
    res.json({
      status: 'root'
    });
  }

  create(req, res) {
    if (req.busboy) {
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

              // Landscape rules
              // 1) width is larger than height with extra 30 pixel buffer to account for nearsquare images
              // 2) it assumes images have a larger than 600 pixel widths
              if (image.width() > (image.height() + 30)) {
                console.log(`Thumbs > raw file is a Landscape image: ${filename}!`);

                image.clone((e2, clone1) => {
                  if (e2) return console.warn('error creating clone 1:', e2);
                  console.log(`Thumbs > clone 1 created for the raw file of: ${filename}!`);

                  clone1.batch()
                  .scale(parseInt(cfg.thumbs.landscape.lrgWidth, 10) / image.width())
                  .writeFile(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/thumbs/lrg/', filename), (e3) => {
                    if (e3) return console.warn('error write file for clone 1', e3);
                    console.log(`Thumbs > med Thumb created for: ${filename}`);

                    image.clone((e4, clone2) => {
                      if (e4) return console.warn('error creating clone 2:', e4);

                      console.log(`Thumbs > Clone 2 created for the raw file of: ${filename}`);

                      clone2.batch()
                      .scale(parseInt(cfg.thumbs.landscape.medWidth, 10) / image.width())
                      .writeFile(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/thumbs/med/', filename), (e5) => {
                        if (e5) return console.warn('error write file for clone 2', e5);
                        console.log(`Thumbs > lrg Thumb created for: ${filename}`);

                        image.clone((e6, clone3) => {
                          if (e6) return console.warn('error creating clone 3:', e6);

                          console.log(`Thumbs > clone 3 created for the raw file of: ${filename}`);

                          clone3.batch()
                          .scale(parseInt(cfg.thumbs.landscape.smlWidth, 10) / image.width())
                          .writeFile(path.join(__dirname, '/../..', cfg.thumbs.storageRoot, '/thumbs/sml/', filename), (e7) => {
                            if (e7) return console.warn('Error write file for clone 3:', e7);
                            console.log(`Thumbs > sml Thumb created for: ${filename}`);

                            console.log('Thumbs > All done, lets return a success.');

                            res.json({
                              ok: '1',
                              filename
                            });
                          });
                        });
                      });
                    });
                  });
                });
              }
              else {
                console.log('its portrait');
              }
            }
            else {
              console.warn(`Thumbs > Error the raw file for: ' ${filename}`);
            }
          });
        });
      });

      req.busboy.on('field', (fieldname, val) => {
        console.log(`Thumbs > busboy - field received : Field [' ${fieldname} ']: value: ' ${inspect(val)}`);
      });

      req.busboy.on('finish', () => {
        console.log('Thumbs > busboy - middleware processing done');
      });

      console.log('Thumbs > start save workflow');

      req.pipe(req.busboy);
    }
    else {
      console.error('Thumbs > Save new asset could not be done as busboy not found in web request');
    }
  }
}

export default Thumbs;