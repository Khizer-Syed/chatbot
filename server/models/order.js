const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _id: { type: Number, default: 10001001 },
    category: { type: String, default: 'Pizza'},
    type: { type: String, required: true },
    size: { type: String, required: true },
    toppings: [{ type: String, required: true }],
    status: { type: String , enum: ['ACTIVE', 'FULFILLED', 'CANCELLED'], default: 'ACTIVE'},
    instructions: String,
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    created_at: Date,
    updated_at: Date
});

orderSchema.pre('save', function(next) {
    const doc = this;
    Order.findOne({},{},{sort: { '_id' :-1}}, function(error, order)   {
        if(order){
            const orderId = order._id;
            doc._id = orderId + 1;
        }
        const currentDate = new Date();
        this.updated_at = currentDate;
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
