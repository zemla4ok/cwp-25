const http2 = require('http2');
const fs = require('fs');

const key = fs.readFileSync('localhost.key');
const cert = fs.readFileSync('localhost.cert');

const server = http2.createSecureServer(
  { key, cert },
  onRequest
);

function onRequest(req, res) {
  console.log(req.headers[':path']);

  res.stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });

  res.stream.end('<h1>Hello World</h1>');
}

server.listen(8443, 'localhost', () => {
    console.log('Server is running');
  });