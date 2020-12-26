const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const toppingschema = new Schema({

  // pizzaref: {
  //   type: 'String',
  //   ref: "mypizza",
  // },
  toppingName: {
    type: String,
    required: true,
    max: 15,
  },
  description: {
    type: String,
  },
  toppingCost: {
   type:Number,
  },
}, 
{ collection: "mytopping" }

);

const topping = mongoose.model("topping", toppingschema);

module.exports = topping;
