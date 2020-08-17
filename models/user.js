var mongoose    = require('mongoose');
var bcrypt      = require('bcryptjs');
var schema      = mongoose.Schema;

var userSchema  = new schema({
  username:{
      type:String,
      required:true
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  password:{
      type:String,
      required:true
  },
  question:{
      type:String,
      required:true
  },
  answer:{
      type:String,
      required:true
  }
});

var userModel = module.exports = mongoose.model('user',userSchema);

module.exports.register = (user,cb)=>{
     bcrypt.genSalt(10,(err,salt)=>{
          if(err){
              cb('error occured',null);
          }
          bcrypt.hash(user.password,salt,(err,hash)=>{
             if(err){
                 cb('error occured',null);
             }
             user.password = hash;
             user.save((err,udata)=>{
                if(err){
                    cb('error occured data not saved',null);
                }
                cb(null,udata);
             });
          });
     }); 
}


module.exports.email=(email,cb)=>{
    userModel.find({email:email},(err,udata)=>{
       if(err){
           cb('some error occured',null);
       }
       cb(null,udata)
    });
}

module.exports.comparePassword=(password,hash,cb)=>{
    bcrypt.compare(password,hash,(err,udata)=>{
        if(err){
            cb('some error occured',udata);
        }
        cb(null,udata);
    }); 
}

module.exports.editProfile=(userId,cb)=>{
    userModel.findById({_id:userId},(err,udata)=>{
       if(err){
           cb('some error ocured',null);
       }
       cb(null,udata);
    });
}

module.exports.updateProfile=(user,id,cb)=>{
    userModel.updateOne({'_id':id},{$set:user},(err,udata)=>{
        if(err){
            cb('some error occured',null);
        }
        cb(null,udata);
    });
}

module.exports.deleteProfile = (id,cb)=>{
    userModel.deleteOne({_id:id},(err,udata)=>{
       if(err){
           cb('some error occured',udata);
       }
       cb(null,udata);
    });
}

module.exports.forgetPassword=(email,cb)=>{
 userModel.find({email:email},{question:1},(err,udata)=>{
    if(err){
        cb('some error occured',null);
    }
    cb(null,udata);
 });
}

module.exports.getQuestion=(email,cb)=>{
    userModel.find({email:email},{question:1,email:1},(err,udata)=>{
        if(err){
            cb('some error occured',null);
        }
        cb(null,udata);
    });
}

module.exports.matchAnswer=(email,answer,cb)=>{
 userModel.find({email:email},(err,udata)=>{
     if(err){
         cb(err,null);
     }
     if(udata[0].answer === answer){
       cb(null,'matched');
     }
     else{
         cb(null,false);
     }
 });
};

module.exports.resetPassword = (email,password,cb)=>{
    bcrypt.genSalt(10,(err,salt)=>{
      if(err){
          cb('some error occured',null);
      }
      bcrypt.hash(password.password,salt,(err,hash)=>{
        if(err){
            cb('some error occured',null);
        }
       userModel.update({'email':email},{$set:{password:hash}},(err,udata)=>{
          if(err){
              cb(err,null);
          }
         cb(null,udata);
       });
      });
    });
}