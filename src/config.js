export default {
  env: 'production',
  port: 7000,
  trashOriginal: false,
  storageRoot: '/public/imgs', // or user "/storage" if a mounted directory is used. ** see below
  lrgWidth: 600,
  medWidth: 312,
  smlWidth: 160,
  imgCache: 31536000, // cache imgs for 8 hours here (its in ms)
  skipImgTs: false // dont append a timestamp on the physical image name
};

// **
// By default thumby stores images in the local "/public/imgs" folder.
// but this only works if you are running thumby in a standalone server.
// if you are running it in a container (like docker or dokku) then "/public/imgs" gets
// nuked at each rebuild. in this case you should mount a persistent host directory to a
// virtual directory called "/storage" inside your docker container.
// for e.g. you can mount "/var/lib/your-app/storage" in your host server to "/storage"
// inside your docker container and then change the "storageRoot" config setting in "/src/config.js"
// to be '/storage'. the directory names "storage" is recommended as in the code found in /app.js
// we set this value as a static location so you can reference your images via the web.
