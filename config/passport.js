const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require("../models/User");
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const verifyCallback= async (jwt_payload,done)=>{

  const user=await User.findById(jwt_payload.id)

  if(user)
  {
      return done(null,user);
  }
  return done(null,false);

}
const strategy=new JwtStrategy(opts,verifyCallback);

const passport=()=>{
       passport.use(strategy)
}

module.exports=(passport)=>{
    passport.use(strategy)
}