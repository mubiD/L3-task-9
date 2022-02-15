const mongoose = require('mongoose'); //Require Mongoose.

//Build Schema for documentation.
let User = mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  tasks:{
    type:Array,
    required:true
  }//,
  // createDate:{
  //   type:Date,
  //   required:false,
  //   default: Date.now
  // }
});

//Create the model using mongoose.
//First param is the collection name. second is the name of the model created.
module.exports = mongoose.model('users', User);