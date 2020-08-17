var express     = require('express');
var mongoose    = require('mongoose');
var session     = require('express-session');
var bodyParser  = require('body-parser');
var path        = require('path');
var dbConnect   = require('./config/connect').connect;

//connect to db
mongoose.connect(dbConnect.db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connected to db')).catch((err)=>console.log('connection error',err))

//init app
var app = express();

//set template engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//set froala editor path
app.use('/froalacss',express.static(__dirname+'/node_modules/froala-editor/css/froala_editor.pkgd.min.css'));
app.use('/froalajs',express.static(__dirname+'/node_modules/froala-editor/js/froala_editor.pkgd.min.js'));

// fetch form data
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//session
app.use(session({
    secret:'mySECRETKEY_123456',
    saveUninitialized:false,
    resave:false
  })
);

//path of public folder
app.use(express.static(path.resolve(__dirname,'public')));

//default page load
app.get('/',(req,res)=>{
     res.redirect('/property/home');
});



//route
app.use('/user',require('./routes/userRoute'));
app.use('/property',require('./routes/propertyRoute'));

//setup port 
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log("server run at port",port));