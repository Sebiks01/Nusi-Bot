const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    channelId: reqString,
  },
  {
    timestamps: true,
  }
);

const name = 'suggestionsChannel';

module.exports = mongoose.models[name] || mongoose.model(name, schema, name);
