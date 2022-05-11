AWS = require('aws-sdk');

const S3_INSTANCE = new AWS.S3({
  signatureVersion: "v4",
  accessKeyId: "",
  secretAccessKey: "",
  region: process.env.S3_REGION
});

const APP_PARAMS = [
  {
      app_token: process.env.appToken,
      bucket: process.env.BUCKET,
      accessKey: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
];
  
module.exports = {
  uploadFileS3: async function(appToken, id, name, fileName) {
    let accessKeyId;
    let secretAccessKey;
    let Bucket;
    
    APP_PARAMS.forEach(function(app){
      if(app.app_token === appToken){
        accessKeyId = app.accessKey;
        secretAccessKey = app.secretAccessKey;
        Bucket = app.bucket;
      }
    });
       
    const paramsSignedUrl = {
      Bucket,
      Key: id + "/" + name,
      Metadata: {
        file_name: fileName
      }
    };
    
    let data = {url: await S3_INSTANCE.getSignedUrl("putObject", paramsSignedUrl)};
    if(id.indexOf('public')!==-1)
    data.public_url = data.url.substring(0, data.url.indexOf("?"));
    return data;
    
  },
  
  downloadFileS3: async function(appToken, path) {
    let accessKeyId;
    let secretAccessKey;
    
    let paramsSignedUrl = {
      Key: path,
    };
  
    APP_PARAMS.forEach(app =>{
      if(app.app_token === appToken){
        accessKeyId = app.accessKey;
        secretAccessKey = app.secretAccessKey;
        paramsSignedUrl.Bucket = app.bucket;
      }
    });
     
    return new Promise((resolve, reject) => {
      S3_INSTANCE.headObject(paramsSignedUrl, async (err) => {
        if (err) {
          resolve(err);
        } else {
          paramsSignedUrl.Expires = 604800;
          paramsSignedUrl.ResponseContentDisposition = 'attachment';
          const url =  await S3_INSTANCE.getSignedUrl("getObject", paramsSignedUrl);
          resolve(url);
        }
      });
    });
  }
};
