// models/Invoice.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    owner_id: { type: String ,ref: 'User', required: true }, // userId của người sở hữu thú cưng
    pet_id: { type: String, ref: 'Pet', required: true }, // pet_id của thú cưng
    service_id: { type: String, ref: 'Service', required: true }, // service_id của dịch vụ
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Invoice', invoiceSchema);
