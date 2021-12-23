const express = require('express');
const app = express();
const weatherRouter = require('./routes/index.js');

const musicApiRouter = require('./routes/music_api.js');
const musicPlayRouter = require('./routes/music_play.js');
const musicInfoRouter = require('./routes/music_information.js');

app.use('/api/grid', weatherRouter);

app.use('/music', musicApiRouter);
app.use('/music/play', musicPlayRouter);
app.use('/music/info', musicInfoRouter);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
  });
