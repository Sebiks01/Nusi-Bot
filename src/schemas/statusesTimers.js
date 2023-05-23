const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const schema = new Schema(
  {
    userId: reqString,
    timeInMinutes: reqNumber,
  },
  {
    timestamps: true,
  }
);

const name = 'statusesTimers';

module.exports = mongoose.models[name] || mongoose.model(name, schema, name);
