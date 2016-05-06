import { inspect } from 'util';
import fs from 'fs-extra';
import lwip from 'lwip';
import cfg from '../config';

class Thumbs {
  route(req, res) {
    res.json({
      status: 'root'
    });
  }

  create(req, res) {
    let currTs = +new Date();

    if (req.busboy) {
      req.busboy.on('file', function (fieldname, file, fn, encoding, mimetype) {
        let filename = currTs.toString() + '_' + fn;

        console.log('Controller for /img/thumbs > uploading raw file to originals folder: ' + filename);

        //Path where image will be uploaded
        let fstream = fs.createWriteStream(__dirname + '/../..' + cfg.thumbs.storageRoot + '/originals/' + filename);
        file.pipe(fstream);

        fstream.on('close', function () {
            console.log('Controller for /img/thumbs > raw file upload finished for: ' + filename);

            lwip.open(__dirname + '/../..' + cfg.thumbs.storageRoot + '/originals/' + filename, function(err, image){

                if (!err) {
                  console.log('Controller for /img/thumbs > open and make thumbs for: ' + filename + ' original rez is width = ' + image.width() + ' height = ' + image.height());

                  // Landscape rules
                  // 1) width is larger than height with extra 30 pixel buffer to account for nearsquare images
                  // 2) it assumes images have a larger than 600 pixel widths
                  if (image.width() > (image.height() + 30)) {
                    console.log('Controller for /img/thumbs > raw file is a Landscape image : ' + filename );

                      image.clone(function(err, clone1) {
                          if (err) return console.warn("error creating clone 1:", err);

                            console.log('Controller for /img/thumbs > clone 1 created for the raw file of: ' + filename );

                            clone1.batch()
                                .scale(parseInt(cfg.thumbs.landscape.lrgWidth) / image.width())
                                .writeFile(__dirname + '/../..' + cfg.thumbs.storageRoot + '/thumbs/lrg/' + filename, function(err) {
                                    if (err) return console.warn("error write file for clone 1", err);
                                    console.log('Controller for /img/thumbs > med Thumb created for: ' + filename );

                                    image.clone(function(err, clone2) {
                                        if (err) return console.warn("error creating clone 2:", err);

                                        console.log('Controller for /img/thumbs > Ccone 2 created for the raw file of: ' + filename );

                                        clone2.batch()
                                            .scale(parseInt(cfg.thumbs.landscape.medWidth) / image.width())
                                            .writeFile(__dirname + '/../..' + cfg.thumbs.storageRoot + '/thumbs/med/' + filename, function(err) {
                                                if (err) return console.warn("error write file for clone 2", err);
                                                console.log('Controller for /img/thumbs > lrg Thumb created for: ' + filename );

                                                image.clone(function(err, clone3) {
                                                    if (err) return console.warn("error creating clone 3:", err);

                                                    console.log('Controller for /img/thumbs > clone 3 created for the raw file of: ' + filename );

                                                    clone3.batch()
                                                        .scale(parseInt(cfg.thumbs.landscape.smlWidth) / image.width())
                                                        .writeFile(__dirname + '/../..' + cfg.thumbs.storageRoot + '/thumbs/sml/' + filename, function(err) {
                                                            if (err) return console.warn("Error write file for clone 3:", err);
                                                            console.log('Controller for /img/thumbs > sml Thumb created for: ' + filename );

                                                            console.log('Controller for /img/thumbs > All done, lets return a success.');

                                                            res.json({
                                                              ok: '1',
                                                              filename: filename
                                                            });
                                                    });
                                                });
                                        });
                                    });
                            });
                      });
                  }
                  else {
                      // resize the thumb based on the height as its most probably a portrait image
                  }
                }
                else {
                  console.warn('Controller for /img/thumbs > Error the raw file for: ' + filename);
                }
            });
        });
    });

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Controller for /img/thumbs > busboy - field received : ' + 'Field [' + fieldname + ']: value: ' + inspect(val));
    });

    req.busboy.on('finish', function() {
      console.log('Controller for /img/thumbs > busboy - middleware processing done');
    });

    console.log('Controller for /img/thumbs > start save workflow');

    req.pipe(req.busboy);
    }
    else {
      console.error('Controller for /img/thumbs > Save new asset could not be done as busboy not found in web request');
    }
  }
}

export default Thumbs;
