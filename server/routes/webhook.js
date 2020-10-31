const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { decodeToken } = require('../util/srvUtil');
const { User, Order} = require('../models');


router.post('/', async (req, res) => {
  try {
    let message;
    const promise = new Promise((resolve) => {
      const [email, password] = decodeToken(req.headers.authorization).split(':');
      return User.findOne({email}).then(user => {
        if (!user) {
          const newUser = new User({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: bcrypt.hashSync(password, 10),
            phone: '(647) 617-4232',
            address: {
              addressLine1: '21 Hashburn Avenue',
              city: 'Toronto',
              province: 'Ontario',
              postalCode: 'L6R 2G4'
            },
          });
          return newUser.save().then(user => resolve(user));
        } else {
          return bcrypt.compare(password, user.password).then((authenticated) => {
            if (!authenticated) {
              throw new Error('User not authenticated');
            }
            resolve(user);
          });
        }
      });
    });
    const user = await promise;
    switch (req.body.queryResult.action) {
      case 'order':
        const [context] = req.body.queryResult.outputContexts.filter(context => context.name.toString().indexOf('/orderintent-followup') !== -1);
        const { parameters : { type, size, toppings }} = context;
        const [first, second, third] = toppings;
        const instructions = req.body.queryResult.queryText;
        const order = new Order({
          type,
          size,
          toppings,
          instructions,
          customer: user._id,
        });
        const newOrder = await order.save();
        if (!newOrder) {
          res.status(400).send({ message: 'Error saving the order' });
        }
        message = `Your order is successfully placed. Your order Id is ${ newOrder.id }. You have selected a ${size} ${type} pizza with ${first}, ${second} and ${third} toppings. You will be notified when your order is ready.
                Thank you for calling Pizza Palace`;
        break;
      case 'cancel':
        const { parameters : { orderId }} = req.body.queryResult.outputContexts[0];
        await Order.findOneAndDelete({ customer: user._id, status: 'ACTIVE', _id: orderId });
        message = 'Your order has been successfully cancelled';
        break;
    }
    const source = req.body.originalDetectIntentRequest.source;
    switch (source) {
      case 'google':
        res.status(200).json(
          {
            "payload": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": message
                      }
                    }
                  ]
                }
              }
            }
          }
        );
        break;
      default:
        res.status(200).json(
          {
            "fulfillmentMessages": [
              {
                "text": {
                  "text": [
                    message
                  ]
                }
              }
            ]
          }
        );
    }
  } catch (e) {
    res.status(400).send({e});
  }
});

module.exports = router;
