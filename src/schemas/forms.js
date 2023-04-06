const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    userId: reqString,
    channelId: reqString,
    messageId: reqString,
    a1: reqString,
    a2: reqString,
    a3: reqString,
    a4: reqString,
    a5: reqString,
  },
  {
    timestamps: true,
  }
);

const name = 'forms';

module.exports = mongoose.models[name] || mongoose.model(name, schema, name);
