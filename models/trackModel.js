const mongoose =require('mongoose')
let trackSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"User Id is required"]
},
foodId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"foods",
    required:[true,"Food Id is required"]
},
date:{
    type:String,
    default:new Date().toLocaleDateString()
},
quantity:{
    type:Number,
    required:[true, "Quantity is required"]
}},{timestamps:true})
let trackModel = mongoose.model("tracks",trackSchema);
module.exports = trackModel;

