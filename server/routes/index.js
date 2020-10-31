const webhook = require('./webhook');
const query = require('./query');

module.exports = app => {
  app.use('/api/webhook', webhook);
  app.use('/api/query', query);
};
