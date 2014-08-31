var express = require('express');
var app = express();

app.use(express.static('root'));
app.listen(80);
