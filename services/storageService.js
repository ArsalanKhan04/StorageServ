const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = process.env.GCS_BUCKET_NAME;

const uploadToGCS = async (filePath, datenow) => {
  const destination = `videos/${datenow}-${filePath}`;
  await storage.bucket(bucketName).upload(filePath, {
    destination,
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    }
  });
  return `https://storage.googleapis.com/${bucketName}/${destination}`;
};

const deleteFromGCS = async (filename) => {
  console.log(filename);
  await storage.bucket(bucketName).file(filename).delete();
};

module.exports = { uploadToGCS, deleteFromGCS };
