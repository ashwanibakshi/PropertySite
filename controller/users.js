var userModel = require('../models/user');

var msgs =[];
var userController ={
    getRegister(req,res){
        res.render('pages/register');
    },
    postRegister(req,res){
        try {
            const user = new userModel({
              username:req.body.username,
              email:req.body.email,
              password:req.body.password,
              question:req.body.question,
              answer:req.body.answer
           });
           userModel.register(user,(err,udata)=>{
               if(err){
                   console.log(err);
               }
              //  res.json({'data':udata});/
              else{
              console.log('user regsiter',udata)
              res.redirect('/user/login');
              }
           });
          } catch (error) {
            console.log(error);
          }
    },
    getLogin(req,res){
        res.render('pages/login');
    },
    postLogin(req,res){
        try {
            userModel.email(req.body.email,(err,udata)=>{
              if(err){
                  console.log(err);
                  res.json({'er':err});
              }
              if(udata.length){
              userModel.comparePassword(req.body.password,udata[0].password,(err,match)=>{
                if(err){
                    console.log('comparepass',err);
                }
                else if(match){
                  req.session.uid = udata[0]._id;
                  res.redirect('/property/addProperty');   
                }
                else{
                res.json({'err':'email or password didnt match'});
                }
              });
             }else{
             res.json({'err':'user is not registred'});
             }
           });  
          } catch (error) {
            console.log(error);
          }
    },
    getEditProfile(req,res){
        try {
            userModel.findById({_id:req.params.id},(err,data)=>{
                 if(err){
                   console.log(err)
                 }
                 res.json({da:data});
            });
          } catch (error) {
            console.log(error);
          }
    },
    postEditProfile(req,res){
        try {
            var user =  {
              username:req.body.username,
              email:req.body.email,
              question:req.body.question,
              answer:req.body.answer
            }
             userModel.updateProfile(user,req.body.uid,(err,data)=>{
                if(err){
                  console.log(err);
                }
                res.json({da:data});
             });
          } catch (error) {
            console.log(error);
          }
    },
    postDeleteProfile(req,res){
        try {
            userModel.deleteProfile(req.body.uid,(err,data)=>{
              if(err){
                console.log(err);
              }
              res.json({'da':data});
           }); 
          } catch (error) {
            console.log(error);
          }
    },
    getLogout(req,res){
      req.session.destroy();
      res.redirect('/user/login');
    },
    getForgetPassword(req,res){
        res.render('pages/forgetPassword');
    },
    getQuestionAnswer(req,res){
      if(req.session.email){
      userModel.getQuestion(req.session.email,(err,data)=>{
          if(err){
            console.log(err);
          }
          console.log('quest',data);
          msgs =[{
            msg:'enter correct answer '
          }]
          res.render('pages/question',{quest:data,msg:msgs});
      });
    }
    else if(req.query.email){
      userModel.getQuestion(req.query.email,(err,data)=>{
        if(err){
          console.log(err);
        }
        console.log('quest',data);
        req.session.email=req.query.email;
        msgs =[{
          msg:'enter correct answer '
        }]
        res.render('pages/question',{quest:data,msg:msgs});
      });
     }
     else{
       res.redirect('/user/forgetPassword');
     }
    },
    postQuestionAnswer(req,res){
      if(req.session.email){
      userModel.matchAnswer(req.session.email,req.body.answer,(err,data)=>{
             if(err){
               console.log(err);
              res.redirect('/user/question');
             }
             if(data){
             console.log('match',data);
             res.redirect('/user/resetPassword');
             }
             else{
              res.redirect('/user/question');
             }
       });
      }
      else{
        res.redirect('/user/forgetPassword');
      }
    },
    getResetPassword(req,res){
       if(req.session.email){
          res.render('pages/resetpassword',{msg:''});
       }else{
         res.redirect('/user/forgetPassword');
       }
    },
      postResetPassword(req,res){

            if(!req.session.email){
              res.redirect('/user/forgetPassword');
            }
            else{
              if(req.body.newpass == req.body.confirmpass){
                var pass ={
                  password:req.body.newpass
                }
                userModel.resetPassword(req.session.email,pass,(err,data)=>{
                  if(err){
                    console.log(err)
                  }else if(data){
                    console.log('resetpass',data);
                    msgs=[{
                      msg:'password successfully changed'
                    }]
                    res.render('pages/resetPassword',{msg:msgs});
                  }
                });
              }
              else{
                msgs=[{
                  msg:'passwords didnt matched!try again'
                }]
                res.render('pages/resetPassword',{msg:msgs});
              }
          }
    }
}

module.exports = userController;