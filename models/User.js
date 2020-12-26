const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Userschema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
},{collection:'myuser'}) // mention the name of collection explicitly

const MyUser=mongoose.model('myusers',Userschema); // this name won't get use by mongo, above name is taken already.
module.exports=MyUser;
 