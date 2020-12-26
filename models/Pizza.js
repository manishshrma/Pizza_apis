const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      max: 40,
    },
    description: {
      type: String,
    },
    pizzaSize:{
      type:String
    },
    pizzaCost: {
      type: Number,
    },
   
  },  
  { collection: "mypizza" }
);

const Pizza = mongoose.model("pizza", pizzaSchema);

module.exports = Pizza;
