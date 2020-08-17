var mongoose    = require('mongoose');
var schema      = mongoose.Schema;

var propertySchema = new schema({
    pic1:{
        type:String,
        required:true
    },
    pic2:{
        type:String,
        required:true
    },
    pic3:{
        type:String,
        required:true
    },
    pic4:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    ptype:{
        type:String,
        required:true
    },
    pname:{
       type:String,
       required:true
    },
    pfor:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
     type:String,
     required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

var propertyModel = module.exports = mongoose.model('property',propertySchema);

module.exports.home =(cb)=>{
      try {
        propertyModel.find({},{},{sort:{_id:-1},limit:6},(err,data)=>{
            if(err){
                console.log(err);
            }
            cb(null,data);  
       });
      } catch (error) {
          console.log(error);
      }
}

module.exports.addProperty = (prop,cb)=>{
  try {
    prop.save((err,propData)=>{
        if(err){
            console.log('sds',err);
            cb('some error occurred',null);
        }else{
        cb(null,propData);
        }
     });
  } catch (error) {
      console.log(error);
  }   
 
}

module.exports.editProperty = (id,cb)=>{
    try {
        propertyModel.find({_id:id},(err,propData)=>{
            if(err){
                cb('some error occurred',null);
            }
            cb(null,propData);
         });
    } catch (error) {
        console.log(error);
    }
}

module.exports.updateProperty = (prop,id,cb)=>{
  try {
    propertyModel.update({_id:id},{$set:prop},(err,propData)=>{
        if(err){
            cb('some error occurred',null);
        }
        cb(null,propData);
      });
  } catch (error) {
       console.log(error);
  }
}

module.exports.showFrontProperty=(cb)=>{
   try {
    propertyModel.find({},{limit:10},(err,propData)=>{
        if(err){
            cb('some error occurred',null)
        }
        cb(null,propData);
    });
   } catch (error) {
       console.log(error);
   }
}
var query ={};

module.exports.showAllUserProperty=(userid,pageNo,pageSize,cb)=>{
    try {
        query.skip = pageSize*(pageNo-1);
        query.limit=pageSize;
        propertyModel.find({userId:userid},{},query,(err,propData)=>{
           if(err){
               cb(err,null);
           }
        propertyModel.find({userId:userid}).count((err,countData)=>{
              if(err){
                console.log('err',err);
                cb(err,null);
              }
              console.log('count',countData);
              var x={
                  data:propData,
                  count:countData
              }
              cb(null,x);
         });
        });   
    } catch (error) {
        console.log(error);
    }
}

module.exports.propertyDetails=(propId,cb)=>{
    try {
        propertyModel.find({_id:propId},(err,propData)=>{
            if(err){
                cb('some error occurred',null);
            }
            cb(null,propData);
        });   
    } catch (error) {
        console.log(error);
    }
}

module.exports.propertyDelete= (propId,cb)=>{
    try {
        propertyModel.deleteOne({_id:propId},(err,propData)=>{
            if(err){
                cb('some error occured',null);
            }
            cb(null,propData);
         });   
    } catch (error) {
        console.log(error);
    }
}

module.exports.showAllProperty=(pageNo,cb)=>{
    try {
        var pageSize =5;
        query.skip  = pageSize*(pageNo-1);
        query.limit = pageSize;
        propertyModel.find({},{},query,(err,data)=>{
           if(err){
               console.log(err);
               cb(err,null);
           }
           propertyModel.count((err,countData)=>{
                if(err){
                    cb(err,null);
                }
                var x = {
                    count:countData,
                    data:data
                }
                cb(null,x);
           });
        });   
    } catch (error) {
        console.log(error);
    }
}

module.exports.deleteProperty=(id,cb)=>{
    try {
        propertyModel.deleteOne({_id:id},(err,data)=>{
            if(err){
              cb(err,null);
            }
            cb(null,data);
           });     
    } catch (error) {
        console.log(error);
    }
}

module.exports.searchProperty = (prop,pageNo,pageSize,cb)=>{
    try {
        console.log('pageno',pageNo)
          var query   = {} ;
          query.skip  = pageSize*(pageNo-1);
          query.limit = pageSize;
          var dataa;
        if(prop==''){
            propertyModel.find({},{},query,(err,data)=>{
                if(err){
                    cb(err,null);
                }
                else{
                    propertyModel.count((err,countData)=>{
                       if(err){
                           cb(err,null);
                       }else{
                           console.log('da',data);
                           dataa={
                              data:data,
                              count:countData
                          }        
                          cb(null,dataa);   
                       }
                    });
                }
            });
        }
        else{
           if(prop.price == "above 100000"){
               console.log('peorepr',prop);
          propertyModel.find({$and:[{state:prop.state},{ptype:prop.ptype},{pfor:prop.pfor},{price:{$gte:100000}}]},{},query,(err,data)=>{
             if(err){
                 console.log(err);
                  cb(err,null);
                } 
                propertyModel.count({$and:[{state:prop.state},{ptype:prop.ptype},{pfor:prop.pfor},{price:{$gte:100000}}]},(err,countData)=>{
                 if(err){
                     console.log(err);
                     cb(err,null);
                 }
                 dataa={
                    data:data,
                    count:countData
                }
                console.log('100000',dataa.data);
              cb(null,dataa);
                });
          });
           }else{
            var x = prop.price.split('-');
            console.log('PROP',prop);
            console.log('sdsd',x[0].replace(/['"]+/g, ''),x[1].replace(/['"]+/g, '')); 
            x[0]=x[0].replace(/['"]+/g, ''),
            x[1]=x[1].replace(/['"]+/g, '')
            console.log(x[0],x[1])
            propertyModel.find({$and:[{state:prop.state},{ptype:prop.ptype},{pfor:prop.pfor},
                {price:{$lte:x[1],$gte:x[0]}}]},{},query,(err,data)=>{
                if(err){
                 console.log(err);
                }
                console.log('search',data);
                propertyModel.count({$and:[{state:prop.state},{ptype:prop.ptype},
                {pfor:prop.pfor},{price:{$lte:x[1],$gte:x[0]}}]},(err,countData)=>{
                    if(err){
                        console.log(err);
                        cb(err,null);
                    }
                    console.log('count',countData)
                   dataa={
                       data:data,
                       count:countData
                   }
                   cb(null,dataa);
                });
            });
         }
       }       
    } catch (error) {
        console.log(error);
    }
}

    module.exports.statesData =(cb)=>{
        try {
            propertyModel.distinct('state',(err,data)=>{
                if(err){
                    console.log('dsfsdf',err);
                    cb(err,null);
                }else{
                    cb(null,data);
                }
            });
        } catch (error) {
            console.log(error);
        }   
    }