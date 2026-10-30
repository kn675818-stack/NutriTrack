const mongoose = require('mongoose');
let foodSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Name is Mandatory"]
        },
    category:{
        type:String,
        required:[true, "Category is mandatory"]
    },
    image:{
        type:String,
   required:[true, "image is mandatory"]
    },
    servingSize:{
        type:Number,
        default:100,
        required:[true, "SS is Mandatory"]
    },
    servingUnit:{
        type:String,
        required:[true,"Su is Mandatory"],
        default:"g"
    },
    calories:{
        type:Number,
        default:0,
        required:[true,"Cal is Manadtory"]
    },
   proteins:{
        type:Number,
        default:0,
        required:[true,"Proteins is Manadtory"]
    }, 
    carbs:{
        type:Number,
        default:0,
        required:[true,"Carbs is Manadtory"]
    },
    fats:{
        type:Number,
        default:0,
        required:[true,"fats is Manadtory"]
    },
    fiber:{
        type:Number,
        default:0,
        required:[true,"Fiber is Manadtory"]
    },
    sugar:{
        type:Number,
        default:0,
        required:[true,"Sugar is Manadtory"]
    },
    saturatedFat:{
        type:Number,
        default:0,
        required:[true,"Sf is mandatory"]
        },
        cholesterol:{
        type:Number,
        default:0,
        required:[true,"Cholestrol is Manadtory"]
    },
    sodium:{
        type:Number,
        default:0,
        required:[true,"sodium is Manadtory"]
    },
    potassium:{
        type:Number,
        default:0,
        required:[true,"potassium is Manadtory"]
    },
    vitaminC:{
        type:Number,
        default:0,
        required:[true,"VitaminC is Manadtory"]
    },
    calcium:{
        type:Number,
        default:0,
        required:[true,"calcium is Manadtory"]
    },
    iron:{
        type:Number,
        default:0,
        required:[true,"iron is Manadtory"]
    },
    foodType:{
        type:String,
        default:"Veg",
        required:[true,"foodType is Manadtory"]
    }
},
{timestamps:true}
)

let foodModel = mongoose.model("foods",foodSchema);
module.exports = foodModel;