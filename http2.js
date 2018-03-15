const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const key = fs.readFileSync('localhost.key');
const cert = fs.readFileSync('localhost.cert');
const {HTTP2_HEADER_PATH} = http2.constants;

const server = http2.createSecureServer(
  { key, cert },
  onRequest
);

function onRequest(req, res) {
  console.log(req.headers[':path']);

  const filePath = path.join('./public', req.headers[':path']);
  if(req.headers[':path'] === '/index.html'){
    push(req.stream, 'site.css');
    push(req.stream, 'app.js');
  }
  req.stream.respondWithFile(filePath,
                        {'content-type': mime.getType(filePath)});
}

function push(stream, filePath) {
  const fullResourcePath = path.join('./public', filePath);
  const {descriptor, headers} = getFileInfo(fullResourcePath);
  const pushHeaders = {[HTTP2_HEADER_PATH]: '/' + filePath};

  stream.pushStream(pushHeaders, (err, pushStream) => {
      pushStream.respondWithFD(descriptor, headers)
  });
}

function getFileInfo(filePath) {
  const descriptor = fs.openSync(filePath, 'r');

  const stat = fs.fstatSync(descriptor);
  const contentType = mime.getType(filePath);

  return {
      descriptor,
      headers: {
          'content-length': stat.size,
          'last-modified': stat.mtime.toUTCString(),
          'content-type': contentType
      }
  }
}

server.listen(8443, 'localhost', () => {
    console.log('Server is running');
  });