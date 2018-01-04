const mongoose = require('mongoose');

// ---------------------------------------------
// shul Schema
// ---------------------------------------------

const shulSchema = mongoose.Schema({
  schemaType: { type: String, default: 'shul' },
  adminEmail: {type: String, required: true},
  name: {type: String, required: true},
  called: {type: String, required: true},
  public: {type: Boolean},
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  rabbi: String,
  asstRabbi: String,
  chazan: String,
  board: [{
    title: Date,
    person: String
  }],
  shabbos: {
    minchaErevShabbos: String,
    kabolasShabbos: String,
    shacharis: String,
    mincha: String,
    maariv: String
  },
  weekday: {
    shacharis1: String,
    shacharis2: String,
    shacharis3: String,
    mincha: String,
    maariv1: String,
    maariv2: String
  },
  sundayLegalHoliday: {
    shacharis1: String,
    shacharis2: String,
    shacharis3: String
  },
  events: [{
    label: String,
    date: String,
    desc: String
  }],
  notes: String
});

shulSchema.virtual('shulAddress').get(function() {
  return `${this.address.street} ${this.address.city}, ${this.address.state}  ${this.address.zip}`
  .trim()});

shulSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    adminEmail: this.adminEmail,
    name: this.name,
    called: this.called,
    address: {
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip
    },
    rabbi: this.rabbi,
    asstRabbi: this.asstRabbi,
    chazan: this.chazan,
    board: [{
      title: this.title,
      person: this.person
    }],
    shabbos: {
      minchaErevShabbos: this.minchaErevShabbos,
      kabolasShabbos: this.kabolasShabbos,
      shacharis: this.shacharis,
      mincha: this.mincha,
      maariv: this.maariv
    },
    weekday: {
      shacharis1: this.shacharis1,
      shacharis2: this.shacharis2,
      shacharis3: this.shacharis3,
      mincha: this.mincha,
      maariv1: this.maariv1,
      maariv2: this.maariv2
    },
    sundayLegalHoliday: {
      shacharis1: this.shacharis1,
      shacharis2: this.shacharis2,
      shacharis3: this.shacharis3
    },
    events: [{
      label: this.label,
      date: this.date,
      desc: this.desc
    }],
    notes: this.notes
  };
}

const Shul = mongoose.model('Shul', shulSchema);

module.exports = {Shul};
