const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    channelId: reqString,
    messageId: reqString,
  },
  {
    timestamps: true,
  }
);

const name = 'recruitmentMessages';

module.exports = mongoose.models[name] || mongoose.model(name, schema);