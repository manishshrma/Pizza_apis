const express = require("express");
const router = express.Router();
const passport = require("passport");
const Pizza=require("../../models/Pizza");
const Topping=require("../../models/Topping");
///// seeder function//////
function generateRandom(x){
    return 10*x;
}

///////////////Fetch the pizza and toppings////////////
router.post("/fetchlist",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const {select_pizzas,select_toppings}=req.body;

    if(!select_pizzas){
       res.status(200).json({success:false,message:`No pizza to fetch`})
    }
    if(!select_toppings){
        res.status(200).json({success:false,message:`No toppings to fetch`})
    }

    const pizzadocs=await  Pizza.find({pizzaName:{$in: select_pizzas  }})
    const toppingdocs=await Topping.find({ toppingName:{$in:select_toppings  }})


    const pizza_list=pizzadocs.map((pizza)=>pizza.pizzaName);
    const toppings_list=toppingdocs.map((topping)=>topping.toppingName);

    const List={pizza_list,toppings_list};

    res.status(200).json({success:true,message:{Avail_pizzas:`${List.pizza_list}`,Availtoppings:`${List.toppings_list}`}})
  
    })
//////////Assign  pizzas and toppings cost in the store///////////////////////
router.post("/assignPrice",passport.authenticate('jwt',{session:false}),async(req,res)=>{

    const pizzaArray=await Pizza.find().map((pizza)=>pizza);
    const toppingArray=await Topping.find().map((topping)=>topping);

    //add prices to each pizzas
  const pizzaName_Array=  pizzaArray.map((pizza)=>{
       return pizza.pizzaName; 
    })
    for(pname of pizzaName_Array){
        await Pizza.updateOne({pizzaName:pname},{$set:{pizzaCost:generateRandom(Math.floor(Math.random()*10)+1)}})
    }
//adding prices to toppings
    const toppingname_Array=  toppingArray.map((topping)=>{
        return topping.toppingName; 
     })
     for(tname of toppingname_Array){
         await Topping.updateOne({toppingName:tname},{$set:{toppingCost:generateRandom(Math.floor(Math.random()*10)+1)}})
     }

     res.status(200).json({success:true,message:`prices has been added`})
}) 
////////////choose pizza and toppings(user)/////////////////

 router.post("/choosepizza", async (req, res) => {


        const { pizzaName, toppings } = req.body

        if(pizzaName==null){
            res.status(400).json({success:false,message:`pleas also add pizza`})
        }
        if(!toppings)
        {
            res.status(400).json({success:false,message:`For ${pizzaName} pizza choose toppings from available store`})

        }

        const pizza = await Pizza.findOne({
            pizzaName: pizzaName,
        })
        console.log(pizza);
        if(pizza==null){
            res.status(400).json({success:false,message:`choose available pizza from the store`})
        }

        const Alltoppings = await Topping.find({
            toppingName: {
                $in: toppings,
            },
        })
        const toppingsArray = Alltoppings.map((topping) => {
            return topping.toppingName
        })
        const result = {
            pizzaName: pizza.pizzaName,
            toppings: toppingsArray,
        }
        res.status(200).json({success:true,message:{Choosen_Pizza:`${result.pizzaName}`,choosen_toppings:`${result.toppings}`}});
    })

///////////////get total cost(user)////////////////////

router.post("/getTotalCost", async (req, res) => {
    const { pizzaName, toppings } = req.body

    const pizza = await Pizza.findOne({ pizzaName: pizzaName,}, {pizzaCost: 1,_id: 0,})
    
    if (pizza) {
        res.status(400).json({
            success: false,
            message: ` As ${pizzaName} pizza not in the store , can't to calculate cost`
        })
    }

    const toppingsArray = await Topping.find({toppingName: {$in:toppings},}, {toppingCost: 1,_id: 0})
    let totalToppingsCost = 0
    toppingsArray.map((item) => { 
        totalToppingsCost += item.toppingCost
    })
    const totalCost = pizza.pizzaCost + totalToppingsCost
    res.status(200).json({
        success: true,
        message: `Total cost for the pizza is ${totalCost}`
    })
})
module.exports=router; 