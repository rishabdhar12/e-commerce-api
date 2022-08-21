const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
    },
    password: {
      type: String,
      requried: true,
    },
    isAdmin: {
      default: false,
      type: Boolean,
    },
    token: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    otp: {
        type: String,
    },
  },
  { collection: "user" }
);

module.exports = new mongoose.model("UserSchema", UserSchema);
