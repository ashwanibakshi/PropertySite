var express         = require('express');
var multer          = require('multer');
var chkAuth       = require('../config/authentication').checkAuth;
var router          = express.Router();
var propertyController = require('../controller/property');


//=================== multer =======================//
var storage = multer.diskStorage({
  destination:(req,file,cb)=>{
     cb(null,'./public/uploads');
  },
  filename:(req,file,cb)=>{
     cb(null,file.originalname);
  }
 });

 var uploads = multer({storage:storage});
//=================== xxxxxx ======================//




//============================ property apis ==================================//

router.get('/home',propertyController.getHome);

router.get('/addProperty',chkAuth,propertyController.getAddProperty);

router.post('/addProperty',chkAuth,uploads.array("pic",4),propertyController.postAddProperty);

router.get('/propertyDetail/:id',propertyController.getshowPropertyDetail);

router.get('/editProperty/:id',chkAuth,propertyController.getEditProperty);

router.post('/editProperty',chkAuth,propertyController.postEditProperty);

router.get('/showAllProperty',chkAuth,propertyController.showAllProperty);

router.get('/deleteProperty/:id',chkAuth,propertyController.deleteProperty);

router.get('/showUserProperty',chkAuth,propertyController.getallUserProperty);

router.get('/searchProperty',propertyController.getsearchProperty);

router.get('/aboutus',propertyController.getAboutUs);

router.get('/contactus',propertyController.getContactUs);

//================================ xxxxxxxx ===================================//


module.exports = router;