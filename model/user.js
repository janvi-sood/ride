const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
   userName : {
        type : String , 
        required : true
           },
    userEmail:{
            type : String,
            required : true
           },
    password: {
        type : String , 
        required : true
           } ,
    userPhoneNo : 
    {
        type : Number , 
        required : true
    } ,
   isBlock : {
    type : Boolean , 
    default  : false
   },
    token: {
        type : String , 
         },
    resetToken :{
            type : String
   
       },
    resetTokenExpiry:{
            type: Date,
       } 

    });

module.exports = mongoose.model('user', userSchema);

