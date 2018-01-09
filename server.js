'use strict'

const express = require('express');
const fs = require('fs');
const app = express();
// app.use(express.static('public'))

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const morgan = require('morgan');
app.use(morgan('common'));

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {User} = require('./models/users-model.js');
const {Shul} = require('./models/shuls-model.js');
const {Member} = require('./models/members-model.js');
const {Services} = require('./models/services-model.js');

// var moment = require('moment');
// var fomatted_date = moment(photo.date_published).format('YYYY-DD-MM');

// **********************************
//  home / landing page
// **********************************

let templates = {
  main: null
};

let initialized = false;
function initialize() {
  if( initialized )
    return initialized;
  templates.main = fs.readFileSync(__dirname + '/public/index.html');
  initialized = true;
  return true;
}

app.get("/", (req, res) => {
  initialize();
  res.status(200).sendFile(__dirname + '/public/index.html');
});

// **********************************
//    user endpoints
// **********************************

// --------------
//   GET
// --------------

// localhost:8080/user/gabbai.frankelshul@gmail.com/pw/pooper-scooper
app.get('/user/:email/pw/:pswd', (req, res) => {
  User
    .findOne({email: req.params.email})
    .then(function(user) {
      if (typeof(user) == 'undefined' || user == null) {
          res.status(401).json({error: `Invalid email: ${req.parmams.email}`});
      };
      if (user.pw === req.params.pswd) {
          Shul
            .findOne({id: user.shulId})
            .then((shulObj)=>{
              var data = [shulObj, user];
              res.status(201).json(data);
            })
      }
      else {
          res.status(400).json({error: `Password not valid for User: ${req.parmams.email}`});
      };
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with the login!'});
    });
});

app.get('/user-all', (req, res) => {
  User
    .find()
    .then((users)=>{
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with GET_all_Users'});
    });
});

// --------------
//   POST
// --------------

app.post ('/newUser/:newEmail/pw/:pswd/shulName/:shulName/shulCalled/:shulCalled', (req, res) => {
  Shul
    .create({
      adminEmail: req.params.newEmail,
      name: req.params.shulName,
      called: req.params.shulCalled
    })
    .then(newShul => {
      console.log("ZZZZ" + newShul.id + " =ID");
      User
        .create({
          email: req.params.newEmail,
          pw: req.params.pswd,
          shulId: newShul.id,
          accessLevel: 3
        })
        .then((newUser)=>{
          let data = [newShul, newUser];
          res.status(201).json(data);
        })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal error with Create_New_UserShul'});
    });
});

// --------------
//   PUT
// --------------

app.put('/user/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const toUpdate = {};
  const updateableFields = ['schemaType','email', 'pw', 'shulId', 'accessLevel'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  User
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong with User update'}));
});

// --------------
//   DELETE
// --------------

app.delete('/user/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with User Delete'});
    });
});


// **********************************
//    shul endpoints
// **********************************

// --------------
//   GET
// --------------

app.get('/shul-all', (req, res) => {
  Shul
    .find()
    .then((shuls)=>{
      res.status(201).json(shuls);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with GET_all_Shuls'});
    });
});

app.get('/shul-all-public', (req, res) => {
  Shul
    .find({public: true})
    .then((shuls)=>{
      res.status(201).json(shuls);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with GET_all_public_Shuls'});
    });
});

app.get("/shul/:id", (req, res) => {
  Shul
    .findById(req.params.id)
    .then((shul)=>{
      res.status(201).json(shul);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry with GET_Shul_by_ID'});
    });
});

// --------------
//   POST
// --------------

app.post('/shul', (req, res) => {
  const requiredFields = ['adminEmail', 'name', 'called'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Shul
    .create(req.body)
    .then(shul => res.status(201).json(shul))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal error with Create_New_Shul'});
    });

});

// --------------
//   PUT
// --------------

app.put('/shul/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Shul
    .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong with Shul update'}));
});

// --------------
//   DELETE
// --------------

app.delete('/shul/:id', (req, res) => {
  Shul
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with Shul Delete'});
    });
});

// **********************************
//    member endpoints
// **********************************

// --------------
//   GET
// --------------

app.get('/member-all', (req, res) => {
  Member
    .find()
    .sort({ shulId: 1})
    .then(function(members) {
          res.status(201).json(members);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong getting all Members'});
    });
});

app.get('/member-all/:shulId', (req, res) => {
  Member
    .find({shulId: req.params.shulId})
    .sort({ called: 1})
    .then(function(members) {
          res.status(201).json(members);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong getting Members for Shul'});
    });
});

app.get("/member/:id", (req, res) => {
  Member
    .findById(req.params.id)
    .then((member)=>{
      res.status(201).json(member);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry getting Member by ID'});
    });
});

// --------------
//   POST
// --------------

app.post('/member', (req, res) => {
  const requiredFields = ['shulId', 'familyName', 'hebrewNameFull', 'englishName', 'called'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Member
    .create(req.body)
    .then(member => res.status(201).json(member))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal error with Create_New_Member'});
    });

});

// --------------
//   PUT
// --------------

app.put('/member/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Member
    .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong with Member update'}));
});

// --------------
//   DELETE
// --------------

app.delete('/member/:id', (req, res) => {
  Member
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with Member Delete'});
    });
});

// **********************************
// services endpoints
// **********************************

// --------------
//   GET
// --------------

app.get('/services-all', (req, res) => {
  Services
    .find()
    .sort({ shulId: 1})
    .then(function(services) {
          res.status(201).json(services);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong getting all services'});
    });
});


app.get('/services-all/:shulId', (req, res) => {
  Services
  .find({shulId: req.params.shulId})
  .sort({ dateEnglish: -1})
  .then(function(servicesAll) {
        res.status(201).json(servicesAll);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went terribly wrong with GET all Services'});
  });
});

app.get("/services/:id", (req, res) => {
  Services
    .findById(req.params.id)
    .then((services)=>{
      res.status(201).json(services);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry with GET_Services_by_ID'});
    });
});

// --------------
//   POST
// --------------

app.post('/services', (req, res) => {
  const requiredFields = ['shulId', 'parsha', 'dateHebrew', 'dateEnglish'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Services
    .create(req.body)
    .then(services => res.status(201).json(services))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal error with Create_New_Services'});
    });

});

// --------------
//   PUT
// --------------

app.put('/services/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  Services
    .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong with Services update'}));
});

// --------------
//   DELETE
// --------------

app.delete('/services/:id', (req, res) => {
  Services
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong with Services Delete'});
    });
});


// ********************************************************************

app.use(express.static('public'));

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
