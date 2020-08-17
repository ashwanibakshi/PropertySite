var express     = require('express');
var userControler = require('../controller/users'); 
var router = express.Router();

//=================== user ======================//
router.get('/register',userControler.getRegister);

router.post('/register',userControler.postRegister);

router.get('/login',userControler.getLogin);

router.post('/login',userControler.postLogin);

router.get('/editProfile/:id',userControler.getEditProfile);

router.post('/editProfile',);

router.post('/deleteProfile',userControler.postDeleteProfile);

router.get('/logout',userControler.getLogout);

router.get('/forgetPassword',userControler.getForgetPassword);

router.get('/question',userControler.getQuestionAnswer);

router.post('/question',userControler.postQuestionAnswer);

router.get('/resetPassword',userControler.getResetPassword);

router.post('/resetPassword',userControler.postResetPassword);

// //================= xxxxxxxxxxxx  =============//

module.exports = router;