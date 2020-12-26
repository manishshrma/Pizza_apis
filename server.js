const express=require("express")
const app=express();
const mongoose=require('mongoose');
const passport=require("passport");
app.use(express.json());

const auth=require("./api/routers/auth");
const pizza=require("./api/routers/pizza");
const topping=require("./api/routers/topping");
const pizzaAndtoppings=require("./api/routers/pizzaAndtoppings");
///////////// database configuration////////////
const db=require('./config/keys').mongoURI; 
 
(async ()=>{ 

    try{  
      await mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true});

      console.log("mongodb connected");
    }
    catch(err){ 
        console.log("inside the error code");
        console.log(err);
    }
})(); 
 
// ///////////////db config end////////////////


//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);
    
app.use('/api/auth',auth)
app.use('/api/pizza',pizza);
app.use('/api/topping',topping); 
app.use('/api',pizzaAndtoppings);


const port=process.env.PORT||3000
app.listen(port,()=>{console.log(`server start at ${port}`)})
  