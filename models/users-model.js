const mongoose = require('mongoose');

// ---------------------------------------------
// user Schema
// ---------------------------------------------

const userSchema = mongoose.Schema({

  email: {type: String, required: true},
  pw: {type: String, required: true},
  shulId: {type: String, required: true},
  accessLevel: {type: Number, required: true},
  createDate: {type: Date, required: false, default: Date.now}

});

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    email: this.email,
    shulId: this.shulId,
    accessLevel: this.accessLevel,
    createDate: this.createDate
  };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};
