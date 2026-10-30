const  express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const cors = require('cors')

// Importing Custom Modules

// const userModel = require('./models/usermodel');
// const foodModel = require('./models/usermodel')
const trackModel = require('./models/trackModel');
// Creating A Server



//const data = require('./models/akash');
//data.Action()
const userModel = require('./models/usermodel');
const foodModel =  require('./models/foodModel');


// Creating A Server
const app = express();
// To get the data from client or user
app.use(express.json());
app.use(cors());

// Registor Endpoint 
app.post("/register",(req,res)=>{
    //res.send("It is working")
    let body = req.body;
    bcrypt.hash(body.password,10,async(err,hpass)=>{
        if(!err){
        body.password = hpass;
        try{
        let doc = await userModel.create(body)
        res.status(201).send({message: "User Created"})
    }
    catch(err){
        res.status(500).send("problem While connecting")
    }
    }
    })

    
    
//     userModel.create(body) 
//     .then((data)=>{res.send("User Created Succesfully")})
//     .catch((err)=>{console.log(err)})
})
     // Login Endpoint
    app.post("/login",async(req,res)=>{
        //res.send("Login Working")
        let userCred = req.body;
        try{
        let data = await userModel.findOne({email:userCred.email})
        if(data!==null){
            // res.status(200).send(data);
        bcrypt.compare(userCred.password,data.password,(err,success)=>{
         if(success){
            jwt.sign({email:userCred.email},"Kuldeep@99",(err,token)=>{
                if(token){
                    res.status(200).send({message:"Login Succesfull",Token:token, userId: data._id.toString()})
                }
                else{
                    res.status(500).send({message:"Token Generation Failed"})
                }
            })
         }
         else{
            res.status(500).send({message:"Incorrect password"})
         }   
        })    
        }
        else{
            res.send("User Not Found")
        }
        }
        catch(err){
            res.status(500).send("Server Failure")
            console.log(err)
        }
        
       
    })





// Middleware
function middleware(req,res,next){
   let token =req.headers.authorization.split(" ")[1];
  
   if(token!==null){
    jwt.verify(token,"Kuldeep@99",(err,success)=>{
        if(success){
            console.log("Token is Verified");
            next();
        }
        else{
            console.log("Incorrect Token")
        }
    })
   }
}



// Getting food items Its name


// get foods endpoints
app.get("/getfoods",middleware,async(req,res)=>{
    try{

        let data = await foodModel.find();
        res.status(200).send(data);
    }
    catch(err){
        res.status(500).send("Server failed");
        console.log(err);
    }
})

// add Food Items
app.post("/addfoods",middleware,async(req,res)=>{
    //res.send("Food Item Added Successfully")
    let body = req.body;
    try{
        let doc = await foodModel.create(body);
        res.status(201).send({message:"Food Item Added"})

    }
    catch(err){
        res.status(500).send("Server Failed");
        console.log(err)
    }
})


// Getting food items Its name
app.get('/getfoods/:name',middleware,async(req,res)=>{
let userfood= req.params.name;
    //console.log(userfood)
    //res.send("items are Loading")
try{
    let data = await foodModel.find({name:{$regex:userfood,$options:'i'}});
    res.send(data)
    }
    catch(err){
        console.log(err)
    }
})

// Adding Eaten food
app.post('/addfoodtrack',middleware,async(req,res)=>{
    let userFood = req.body;
    try{
        let data = await trackModel.create(userFood);
        res.status(201).send({message:'Food added into Record'})
    }
    catch(err){
        res.status(500).send({message:"Server Error"})
        console.log(err)
    }
})




// Assigning a Port Number
app.listen(8100,()=>{
    console.log("Server is running on port 8000")
})

// Food Eaten By user till Date
app.get("/gettrackfood/:id",middleware,async(req,res)=>{
    let id = req.params.id;
    try{
        let data = await trackModel.findOne({userId:id}).populate('userId').populate('foodId')
        res.status(200).send(data)
       }
       catch(err){
        res.status(500).send({message:"Server Error"})
        console.log(err)
       }
    // res.send("Geeting Record")
})

// Food Eaten By User On Specific date

app.get("/getfoodtrack/:id/:date",middleware,async(req,res)=>{
  let id = req.params.id;
  let userdate = new Date(req.params.date);
  let strDate = (userdate.getMonth()+1)+"/"+userdate.getDate()+"/"+userdate.getFullYear();
  try{
    let data = await trackModel.find({userId:id,date:strDate}).populate('userId').populate('foodId')
    res.status(200).send(data);
  }
  catch(err){
    res.status(500).send({message:"Server error"});
    console.log(err);
  }
})


// Connecting To Database
mongoose.connect("mongodb://localhost:27017/Fitbit")
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))