const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({origin: true}));
};
