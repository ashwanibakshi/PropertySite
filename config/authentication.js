module.exports.checkAuth = (req,res,next)=>{
    if(req.session.uid){
        next();
    }
    else{
        res.redirect('/user/login');
    }
}