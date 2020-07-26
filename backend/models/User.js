const mongoose = require("mongoose");
const crypto = require("crypto");
const {v4: uuidv4} = require('uuid');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      require: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    inventory: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// vitualizar campo password hash
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv4()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})


// metodo de encrypt password
userSchema.methods = {
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },
  
    encryptPassword: function(password) {
      if(!password) return '';
      try {
        return crypto.createHmac('sha1',this.salt)
        .update(password)
        .digest('hex')
      } catch (err) {
        return "";
      }
    }
  };

module.exports = model("User", userSchema);



