const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const reqDate = {
  type: Date,
  required: true,
};

const schema = new Schema(
  {
    userId: reqString,
    expires: reqDate,
  },
  {
    timestamps: true,
  }
);

const name = 'verificationCooldowns';

module.exports = mongoose.models[name] || mongoose.model(name, schema, name);
