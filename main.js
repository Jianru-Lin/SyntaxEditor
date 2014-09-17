var express = require('express');
var app = express();

var port = process.env.PORT || 80

app.use(express.static('root'));
app.listen(port);
