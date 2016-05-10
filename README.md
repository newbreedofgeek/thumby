# thumbiser
A simple pure node.js service and server to create, store and serve thumbnail images.

### what does it do?
- effectively scales images instead of resizing using width to work out the thumb scales. (so if you have a really tall image it will still use width to generate thumbs, but this should still work well in order to get fixed size thumbs)
- config driven thumb sizes (support lrg, med and sml sizes)
- choose to keep original image or delete it (via config)
- resized images can then be accessed publicly

### get started
install it and use it like below

### installation
- clone repo into your server machine
- run `npm install`
- open `src/config.js` and enter your preferred settings
- run `npm start`

### api usage
- POST your multipart files to `[http://server-root/thumbs/create]`
- resonse will indicate if its a success. e.g response is `{"ok": 1, "filename": "1462510283123_cool_cat.jpg"}`.
- `ok 1` means its a success and `0` means its a fail
- if its a fail then `error` details are given
- if its a success, then saved image name is given in `filename`. which can now be publicly called like so `http://server-root/1462510283123_cool_cat.jpg`

### dev - todo
- write the dame tests
- add config driven cache headers for serving the images
- provide routes to clean up thumbs (delete)

#### change log
- 0.0.3
  - initial working version
