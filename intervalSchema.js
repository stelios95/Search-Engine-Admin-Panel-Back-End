const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

//define the interval document schema
const intervalsSchema = new Schema({
  fullScanInterval: {
    type: String,
    required: true,
    unique: true
  },
  updateContentTime: {
    type: String,
    required: true,
    unique: true
  },
});
intervalsSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Interval", intervalsSchema);
