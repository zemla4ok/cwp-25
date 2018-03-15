const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})