const mongoose = require('mongoose');

// ---------------------------------------------
// services Schema
// ---------------------------------------------

const servicesSchema = mongoose.Schema({
  schemaType: { type: String, default: 'services' },
  shulId: {type: String, required: true},
  parsha: {type: String, required: true},
  dateHebrew: {type: String, required: true},
  dateEnglish: {type: Date, required: true},
  kiddush: {
    made: Boolean,
    sponsor: String,
    pledge: String,
    paid: Boolean
  },
  speaker: String,
  ledDavening: {
    kabolasShabbos: String,
    shacharis: String,
    musaf: String,
    mincha: String
  },
  aliyosShacharis: {
    kohen: {
      member: String,
      pledge: String
    },
    levi: {
      member: String,
      pledge: String
    },
    shlishi: {
      member: String,
      pledge: String
    },
    revii: {
      member: String,
      pledge: String
    },
    chamishi: {
      member: String,
      pledge: String
    },
    shishi: {
      member: String,
      pledge: String
    },
    shevii: {
      member: String,
      pledge: String
    },
    maftir: {
      member: String,
      pledge: String
    }
  },
  aliyosMincha: {
    kohen: String,
    levi: String,
    shlishi: String
  },
  notes: String
});

// servicesSchema.virtual('memberAddress').get(function() {
//   return `${this.address.street} ${this.address.city}, ${this.address.state}  ${this.address.zip}`
//   .trim()});

servicesSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    shulId: this.shulId,
    parsha: this.parsha,
    dateHebrew: this.dateHebrew,
    dateEnglish: this.dateEnglish,
    kiddush: {
      made: this.made,
      sponsor: this.sponsor,
      pledge: this.pledge,
      paid: this.paid
    },
    speaker: this.speaker,
    ledDavening: {
      kabolasShabbos: this.kabolasShabbos,
      shacharis: this.shacharis,
      musaf: this.musaf,
      mincha: this.mincha
    },
    aliyosShacharis: {
      kohen: {
        member: this.member,
        pledge: this.pledge
      },
      levi: {
        member: this.member,
        pledge: this.pledge
      },
      shlishi: {
        member: this.member,
        pledge: this.pledge
      },
      revii: {
        member: this.member,
        pledge: this.pledge
      },
      chamishi: {
        member: this.member,
        pledge: this.pledge
      },
      shishi: {
        member: this.member,
        pledge: this.pledge
      },
      shevii: {
        member: this.member,
        pledge: this.pledge
      },
      maftir: {
        member: this.member,
        pledge: this.pledge
      }
    },
    aliyosMincha: {
      kohen: this.kohen,
      levi: this.levi,
      shlishi: this.shlishi
    },
    notes: this.notes,
  };
}

const Services = mongoose.model('Services', servicesSchema);

module.exports = {Services};
