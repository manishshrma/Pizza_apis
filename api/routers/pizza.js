const express = require("express");
const router = express.Router();
const passport = require("passport");
const Pizza=require("../../models/Pizza");
/////////////// create a pizza //////////

router.post("/",passport.authenticate('jwt',{session:false}),async(req,res)=>{
   const pizza={};
   pizza.pizzaName=req.body.pizzaName;
   pizza.description=req.body.description;
   pizza.pizzaSize=req.body.PizzaSize;
   const savepizza=new Pizza(pizza);
      try {
        const savedPizza = await savepizza.save(); 
        res.status(200).json({success:true,message:'Pizza is created'});
      } catch (err) {
        res.status(400).json({success:false,message:{err}});
      }
    })

    ///////////////get availabel pizza///////////////////

router.get("/:pizza_name",async(req,res)=>{
  const pizza=Pizza.findOne({pizzaName:req.params.pizza_name});
  if(pizza.result==null){
    res.status(400).json(`sorry! current ${req.params.pizza_name} pizza  is not in the store`);
  }
  
  res.status(200).json( `Enjoy your ${pizza.pizzaName} pizza`);
})
module.exports=router;

