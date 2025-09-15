const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
  logo: { type: String, },
  Profile: { type: String, },
  welText: { type: String, required: false },
  MSB: { type: String, required: false },
  MS: { type: String, required: false },
  FO: {
    type: [
      {
        FOI: String,
        FOL: String,
      },
    ],
    default: [],
  },
  EmailIcon: { type: String, },
  EmailT: { type: String, },
  PhoneI: { type: String, },
  PhoneN: { type: String, },
  AddressI: { type: String, },
  AddressT: { type: String, },
  socials: {
    type: [
      {
        title: String,
        link: String,
        icon: String,
        colour: String,
        shape: String,
      },
    ],
    default: [],
  },
});
module.exports = mongoose.model("Home", homePageSchema);
