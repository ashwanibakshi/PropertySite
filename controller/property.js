var propertyModel = require('../models/property');
var ptypee        = require('../public/staticvalues').ptype;
var pforr         = require('../public/staticvalues').pfor;
var url  = require('url');

var propertyController ={

     getHome(req,res){
       try {
        propertyModel.home((err,data)=>{
          if(err){
            console.log(err);
          }
          console.log('dadad',data);
          propertyModel.distinct('state',(err,stateData)=>{
             if(err){
               console.log(err);
             }
             console.log('state',stateData)
             res.render('pages/home',{data:data,state:stateData,navv:'home'});
          });
     }); 
       } catch (error) {
         console.log(error);
       }
     },
    getAddProperty(req,res){
     res.render('propOwn/addProperty',{navv:'addproperty'});
    },
    postAddProperty(req,res){
        try {
            var pic1 = '/uploads/'+req.files[0].originalname;
            var pic2 = '/uploads/'+req.files[1].originalname;
            var pic3 = '/uploads/'+req.files[2].originalname;
            var pic4 = '/uploads/'+req.files[3].originalname;
            console.log(req.body.details);
          
            var prop = new propertyModel({
              pic1:pic1,
              pic2:pic2,
              pic3:pic3,
              pic4:pic4,
              details:req.body.details,
              ptype:req.body.ptype,
              pname:req.body.pname,
              pfor:req.body.pfor,
              area:req.body.area,
              city:req.body.city,
              state:req.body.state,
              price:req.body.price,
              userId:req.session.uid
            });
          
             propertyModel.addProperty(prop,(err,data)=>{
                if(err){
                  console.log(err);
                }
                console.log(data);
                res.redirect('/property/addProperty');
             });
        } catch (error) {
            console.log(error);
        }
    },
    getEditProperty(req,res){
        try {
            propertyModel.editProperty(req.params.id,(err,data)=>{
               if(err){
                 console.log(err);
               }
              //  res.json({'da':data});
              res.render('propOwn/editProperty',{data:data,ptype:ptypee,pfor:pforr,navv:'editproperty'});
            });
          } catch (error) {
            console.log(error);
          }
    },
    postEditProperty(req,res){
        try {
            var prop = {
              details:req.body.details,
              ptype:req.body.ptype,
              pname:req.body.pname,
              pfor:req.body.pfor,
              area:req.body.area,
              city:req.body.city,
              state:req.body.state,
              price:req.body.price,
              userId:req.session.uid
            };
            propertyModel.updateProperty(prop,req.body.id,(err,data)=>{
                 if(err){
                   console.log(err);
                 }
                //  res.json({'da':data});/
                res.redirect('/property/showUserProperty');
            });
          } catch (error) {
            console.log(error);
          }
    },
    deleteProperty(req,res){
        try {
            propertyModel.deleteProperty(req.params.id,(err,data)=>{
                if(err){
                  console.log(err);
                }
                res.redirect('/property/showUserProperty');
            });
        } catch (error) {
            console.log(error);
        }
    },
    showAllProperty(req,res){
        try {
            var page =1;
            if(req.query.page){
              page = req.query.page;
            }
              propertyModel.showAllProperty(page,(err,data)=>{
                 if(err){
                   res.json({'err':err});
                 } 
                 res.render('propOwn/showProperties');
              });
        } catch (error) {
            console.log(error); 
        }
    },
    getallUserProperty(req,res){
       try {
           var page = 1;
           var pageSize=5;
           if(req.query.page){
             console.log('page',req.query.page);
               page = req.query.page;
           }
           propertyModel.showAllUserProperty(req.session.uid,page,pageSize,(err,data)=>{
              if(err){
                  res.json({'err':err});
              }
              res.render('propOwn/showAllUserProperties',{
                  data:data.data,
                  current:page,
                  pages:Math.ceil(data.count/pageSize),
                  navv:'userproperty'
              });
           });
       } catch (error) {
           console.log(error);
       }
    },
    getshowPropertyDetail(req,res){
      try {
        propertyModel.editProperty(req.params.id,(err,data)=>{
          if(err){
            console.log(err);
          }
          propertyModel.distinct('state',(err,distData)=>{
              if(err){
                console.log(err)
              }
              res.render('pages/PropertyDetail',{data:data,states:distData,navv:'propertydetail'});
             })
       });  
      } catch (error) {
        console.log(error);
      }   
    },
    getsearchProperty(req,res){ 
      try {
        var page  = 1;
      var pageSize = 6;
      if(req.query.page){
        page = req.query.page;  
      }
     console.log('req.query.state',req.query.state);
     if(req.query.state){
      var prop={
        state:req.query.state,
        ptype:req.query.ptype,
        pfor:req.query.pfor,
        price:req.query.price
      }
      var urll='/property/searchProperty?state='+req.query.state+'&ptype='+req.query.ptype+'&pfor='+req.query.pfor+'&price='+req.query.price+'';
      
      propertyModel.searchProperty(prop,page,pageSize,(err,data)=>{
          if(err){
            console.log(err)
          }
          propertyModel.distinct('state',(err,distData)=>{
             if(err){
               console.log(err);
             }
             res.render('pages/searchProperty',{
              states:distData,
              data:data.data,
              current:page,
              urls:urll,
              pages:Math.ceil(data.count/pageSize),
              temp:'yes',
              navv:'searchproperty'
            });
          });
      });
    }
    else{
      var prop='';
      propertyModel.searchProperty(prop,page,pageSize,(err,data)=>{
        if(err){
          console.log(err);
        }
        propertyModel.distinct('state',(err,distData)=>{
          if(err){
            console.log(err);
          }
          console.log('states',distData);
          res.render('pages/searchProperty',{
           states:distData,
           data:data.data,
           urlss:'/property/searchProperty',
           current:page,
           pages:Math.ceil(data.count/pageSize),
           navv:'searchproperty',
           temp:'no'
           });
        });
      })
     } 
      } catch (error) {
        console.log(error);
      }
    },
    getAboutUs(req,res){
      res.render('pages/aboutus',{navv:"aboutUs"});
    },
    getContactUs(req,res){
      res.render('pages/contactus',{navv:"contactus"});
    }
}


module.exports = propertyController;