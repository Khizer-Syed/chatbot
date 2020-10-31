const express = require('express');
const path = require("path");
// database
require('./db/connect');

const app = express();

app.use(express.static(path.join(__dirname, "..", "dist")));
// middleware
require('./middleware')(app);

// routes
require('./routes')(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist/index.html"));
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
