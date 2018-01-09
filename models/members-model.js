const mongoose = require('mongoose');

// ---------------------------------------------
// member Schema
// ---------------------------------------------

const memberSchema = mongoose.Schema({
  schemaType: { type: String, default: 'member' },
  shulId: {type: String, required: true},
  familyName: {type: String, required: true},
  hebrewNameFull: {type: String, required: true},
  englishName: {type: String, required: true},
  called: {type: String, required: true},
  regular: Boolean,
  contactInfo: {
    eMail: String,
    cellPhone: Number,
    homeAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      addrNotes: String
    }
  },
  fatherHebrewName: String,
  motherHebrewName: String,
  title: String,
  kohen: Boolean,
  levi: Boolean,
  lastAliya: {
    parsha: String,
    year: String,
    aliya: String
  },
  canLeadDavening: Boolean,
  lastLedDavening: {
    parsha: String,
    year: String,
    tefilla: String
  },
  notes: String,
  occaisions: [{
     name: String,
     month: String,
     day: String
 }]
});

memberSchema.virtual('memberAddress').get(function() {
  return `${this.address.street} ${this.address.city}, ${this.address.state}  ${this.address.zip}`
  .trim()});

memberSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    shulId: this.shulId,
    familyName: this.familyName,
    hebrewNameFull:  this.hebrewNameFull,
    englishName:  this.englishName,
    called:  this.called,
    regular: this.regular,
    contactInfo: {
      eMail: this.eMail,
      cellPhone:this.cellPhone,
      homeAddress: {
        street: this.street,
        city: this.city,
        state: this.state,
        zip: this.zip,
        addrNotes: this.addrNotes
      }
    },
    fatherHebrewName: this.fatherHebrewName,
    motherHebrewName: this.motherHebrewName,
    title: this.title,
    kohen: this.kohen,
    levi: this.levi,
    lastAliya: {
      parsha: this.parsha,
      year: this.year,
      aliya: this.aliya
    },
    canLeadDavening: this.canLeadDavening,
    lastLedDavening: {
      parsha: this.parsha,
      year: this.year,
      tefilla: this.tefilla
    },
    occaisions: [{
       name: this.name,
       month: this.month,
       day: this.day
   }],
    notes: this.notes,
    memberAddress: this.memberAddress
  };
}

const Member = mongoose.model('Member', memberSchema);

module.exports = {Member};
