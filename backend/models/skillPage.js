const mongoose = require("mongoose");

const skillPageSchema = new mongoose.Schema({
    skIcons: {
        type: [],
        default: [],
    },
    skList:{
        type: [
      {
        heading: String,
        list: String,
      },
    ],
    default: [],
    },
    services:{
        type: [
      {
        title: String,
        icon: String,
      },
    ],
    default: [],
    }
});
module.exports = mongoose.model("Skill", skillPageSchema);
