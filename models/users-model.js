const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ---------------------------------------------
// user Schema
// ---------------------------------------------

const userSchema = mongoose.Schema({
  schemaType: { type: String, default: 'user' },
  email: {type: String, required: true},
  pw: {type: String, required: true},
  shulId: {type: String, required: true},
  accessLevel: {type: Number, required: true},
  createDate: {type: Date, required: false, default: Date.now}

});

//  original passwords were not encrypted.
//  remove the straight compare when code goes into production
userSchema.methods.validatePassword = function(password) {
  if ( bcrypt.compare(password, this.pw) )
    return true;
  else {
    if ( password === this.pw )
      return true;
  }
  return false;
}

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    schemaType: this.schemaType,
    email: this.email,
    shulId: this.shulId,
    accessLevel: this.accessLevel,
    createDate: this.createDate
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};
