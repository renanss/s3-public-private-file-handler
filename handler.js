'use strict';

const {downloadFileS3, uploadFileS3} = require('helpers/s3.helper');

module.exports.upload = async (event, context, callback) => {
  
  
  if (event.source === 'serverless-plugin-warmup') {
    return callback(null, 'Lambda is warm!')
  }
  
  
  const app_token = event["queryStringParameters"]['app_token'];
  const id = event["queryStringParameters"]['id'];
  const name = event["queryStringParameters"]['name'];
  const file_name = event["queryStringParameters"]['file_name'];
  
  
  const res = await uploadFileS3(app_token, id, name, file_name);
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify( {data: res}),
    isBase64Encoded: false
  };
  
  callback(null, response);
  
  
};

module.exports.download = async (event, context, callback) => {
  const app_token = event["queryStringParameters"]['app_token'];
  const path = event["queryStringParameters"]['path'];
  
  const res = await downloadFileS3(app_token, path);
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify( {data: res}),
    isBase64Encoded: false
  };
  
  callback(null, response);
};
