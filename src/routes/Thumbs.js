import fs from 'fs-extra';
import lwip from 'lwip';
import cfg from '../config';
import path from 'path';
import Promise from 'bluebird';
import { InvalidRequest, FileUploadError } from '../errors';

class Thumbs {
  constructor() {
    this.image = '';
    this.fname = '';
    this.originalImgLoc = '';

    this.create = this.create.bind(this);
  }

  // promisified lwip thumb creator
  createThumb(subFolder, targetScale) {
    return new Promise((resolve, reject) => {
      this.image.clone((e1, cloned) => {
        cloned.batch()
          .scale(targetScale)
          .writeFile(path.join(__dirname, '/../..', cfg.storageRoot, subFolder, this.fname), (e2) => {
            if (e2) reject(e2);

            resolve();
          });
      });
    });
  }

  // promisified lwip thumbs handler
  createThumbs() {
    return new Promise((resolve, reject) => {
      let lrgScale = 1;
      let medScale = 1;
      let smlScale = 1;

      // do we need a large? (i.e. is the original width larger than our requirment)
      if (this.image.width() > cfg.lrgWidth) {
        lrgScale = cfg.lrgWidth / this.image.width();
      }

      // etc... do we need a med?
      if (this.image.width() > cfg.medWidth) {
        medScale = cfg.medWidth / this.image.width();
      }

      // etc... do we need a sml?
      if (this.image.width() > cfg.smlWidth) {
        smlScale = cfg.smlWidth / this.image.width();
      }

      // create the thumbs
      let promGen = null;

      this.createThumb('/thumbs/lrg/', lrgScale)
        .then(() => {
          promGen = this.createThumb('/thumbs/med/', medScale);
          return promGen;
        })
        .then(() => {
          promGen = this.createThumb('/thumbs/sml/', smlScale);
          return promGen;
        })
        .then(() => {resolve();})
        .catch((e) => {reject(e);});
    });
  }

  // promisified lwip open wrapper
  openFile() {
    return new Promise((resolve, reject) => {
      lwip.open(this.originalImgLoc, (e, image) => {
        if (e) reject(e);

        this.image = image; // lwip image opject

        // trash original if requested
        if (cfg.trashOriginal) {
          fs.removeSync(this.originalImgLoc);
        }

        resolve();
      });
    });
  }

  catchHandler(e, detail) {
    const error = {
      success: false,
      error: {
        code: e.name || null,
        message: e.message || null,
        detail: detail || null
      }
    };

    this.res.status(400).json(error);
    throw e;
  }

  // main route handler
  create(req, res) {
    let processedFiles = 0;

    this.res = res;

    if (!req.busboy) {
      this.catchHandler(new InvalidRequest('No file was uploaded'));
    }

    // wait for file stream to come in
    req.busboy.on('file', (fieldname, file, fn) => {
      processedFiles++;

      this.fname = (!cfg.skipImgTs) ? `${new Date().getTime().toString()}_${fn}` : fn; // file name to use
      this.originalImgLoc = path.join(__dirname, '/../..', cfg.storageRoot, '/originals/', this.fname);  // full path of original image location

      // save the stream to disk
      const fstream = fs.createWriteStream(this.originalImgLoc);
      file.pipe(fstream);

      // wait for file to be saved to disk
      fstream.on('close', () => {
        // async open the file using lwip
        this.openFile()
          .then(() => {
            // create a thumbs async
            const promThu = this.createThumbs().then(() => {
              // success - everything was done
              res.json({
                success: true,
                filename: this.fname
              });
            });

            return promThu;
          })
          .catch((e) => {
            // fail - something failed in workflow, look at error
            this.catchHandler(new FileUploadError('File upload workflow issue'), e);
          });
      });
    });

    req.busboy.on('finish', () => {
      if (processedFiles === 0) {
        this.catchHandler(new InvalidRequest('No file was uploaded'));
      }
    });

    req.pipe(req.busboy); // stream the file via busboy
  }
}

export default Thumbs;
