const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

//define the seed document schema
const seedSchema = new Schema({
  page: {
    type: String,
    required: true,
    unique: true
  },
  isSpa: {
    type: Boolean,
    required: true
  },
  method: {
    type: Number,
    required: true
  },
  numberOfChildren: {
    type: Number,
    required: true
  }
});
seedSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Seed", seedSchema);
