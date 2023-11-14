const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const addressBookSchema = mongoose.Schema({
  country:{
    type : String,
    required:true,
    minLength:3,
    maxLength: 20
  },
  fullName:{
    type : String,
    required:true,
    minLength:3,
    maxLength: 50
  },
  phoneNumber:{
    type:Number,
    required:true,
    minLength:8,
    maxLength: 50
  },
  city:{
    type : String,
    required:true,
    minLength:3,
    maxLength: 50
  },
  area:{
    type : String,
    required:true,
    minLength:3,
    maxLength: 50
  },
  street:{
    type : String,
    required:true,
    minLength:3,
    maxLength: 50
  },
  Building:{
    type : String,
    required:true,
  },
  floor:{
    type : Number,
    required:true,
  },
  Apartment:{
    type : Number,
    required:true,
  },
  zipCode:{
    type : Number,
    required:true,  
  },
  extraDetails:{
    type : String,
    maxLength: 500

  }

})



const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name "],
      minLength: 3,
      maxLength: 15,
    },
    email: {
      type: String,
      require: [true, "please enter your email "],
      unique: true,
      minLength: 8,
      validate: [validator.isEmail, "please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter your Password"],
      minLength: 8,
      // select: false,
    },
    confirmPassword: {
      type: String,
      require: [true, "please confirm your password"],
      validate: {
        validator: function (val) {
          return val == this.password;
        },
        message: "password & return password does not match ",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addressBook: [addressBookSchema]
  },
  { timestamps: true }
);
// hashing pass before insert it inside data
user.pre("save", async function (next) {
  var salt = await bcrypt.genSalt(10);
  // is modified will check if the field is modified and if the dassword has not been modified it will return the another function
  if (!this.isModified("password")) return next();
  let hashedPass = await bcrypt.hash(this.password, salt);
  this.password = hashedPass;
  this.confirmPassword = undefined;
});

user.pre("updateOne",async function(next){
  console.log(this._update.password);
  var salt = await bcrypt.genSalt(10);

  if (!this._update.password) return next();
  let hashedPass = await bcrypt.hash(this._update.password, salt);
  console.log(hashedPass);

  this._update.password = hashedPass;
  return next();
})


module.exports = mongoose.model("users", user);

// id
// "medo123@gmail.com"

// String
// firstName
// mohamed

// String
// secondName
// elshahat

// String
// hashedPassword
// sasjnghucbt45815348

// String

// shippingAddress
// Object

// Object

// billingAddress
// Object

// Object
// admin
// false

/*
=======================
users : 
     "name":"ahmed adel",
     "email":"medo987456@gmail.com",
     "password":"medo987456",

     -------------------

        "name":"mohamed ahmed",
     "email":"mohamedahmed123@gmail.com",
     "password":"mohamedahmed123",
     
-------------------
"name":"ahmedadel",
"email":"ahmedadel258@gmail.com",
"password":"ahmedadel258",



*/
