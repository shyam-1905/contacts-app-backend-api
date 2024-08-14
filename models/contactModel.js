const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    name: {
      type: String,
      required: [true, "Conatct name is required"],
    },
    email: {
      type: String,
      required: [true, "Contact email is required"],
    },
    phone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
