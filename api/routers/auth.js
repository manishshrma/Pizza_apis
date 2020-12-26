const router=require('express').Router(); // think of router as a mini server of your main app(express)
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");
const passport=require('passport');
const key=require("../../config/keys").secretOrKey;
const User=require("../../models/User"); // auth model

///////////register the user///////////////
router.post("/register",passport.authenticate('jwt',{session:false}), async (req,res)=>{

  const user= await User.findOne({email:req.body.email})
  if(user)
  {
      res.status(200).json("email alreaady exist");
  }
  else{
      const salt= await bcrypt.genSalt();
      const hashpassword=await bcrypt.hash(req.body.password,salt);
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            password:hashpassword,
        })
        try {
            const savedUser = await newUser.save();
        
            res.status(200).json(savedUser);
          } catch (err) {
            res.status(400).json(err.message);
          }
    
    }  

})

//////////login the user and get jwt token/////////////

router.post("/login",async (req,res)=>{

  const user=await User.findOne({email:req.body.email});
  if(!user)
  {
      res.status(200).json({success:false,message:`email is not registered`});
  }
  if(user)
  {
       const ismatch=await bcrypt.compare(req.body.password,user.password); 
       if(ismatch)
       {
           const payload={id:user.id,name:user.name,avatar:user.avatar};
           jwt.sign(payload,key,{expiresIn:3600},(err,token)=>{
               res.status(200).json({sucess:true,token: 'Bearer '+token})

           });
       }
       else{
           return res.status(400).json({password:'password incorrect'})
       }
  }
})
module.exports=router