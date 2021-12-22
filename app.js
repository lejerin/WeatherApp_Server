const express = require('express');
const app = express();
const weatherRouter = require('./routes/index.js');
const musicRouter = require('./routes/music.js');

app.use('/api/grid', weatherRouter);
app.use('/music', musicRouter);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
  });
