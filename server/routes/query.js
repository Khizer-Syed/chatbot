const express = require('express');
const router = express.Router();
const dialogFlow = require('dialogflow');
const serviceAccount = require('../config/dialogflow-service-client-access');
const config = require('../config/config');

router.post('/', async (req, res) => {
  const {sessionId, queryInput } = req.body;

  // Create a new session
  const sessionClient = new dialogFlow.SessionsClient({ credentials: serviceAccount  });
  const sessionPath = sessionClient.sessionPath(config.project_id, sessionId);
  const request = {
    session: sessionPath,
    queryInput
  };
  const [response] = await sessionClient.detectIntent(request);
  const { queryResult } = response;
  console.log(`  Query: ${queryResult.queryText}`);
  console.log(`  Response: ${queryResult.fulfillmentText}`);
  if (queryResult.intent) {
    console.log(`  Intent: ${queryResult.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  res.send(queryResult);
});

module.exports = router;
