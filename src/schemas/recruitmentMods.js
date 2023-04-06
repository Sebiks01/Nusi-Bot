const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
  type: String,
  required: true,
};

const schema = new Schema(
  {
    roleId: reqString
  },
  {
    timestamps: true,
  }
);

const name = 'recruitmentMods';

module.exports = mongoose.models[name] || mongoose.model(name, schema);