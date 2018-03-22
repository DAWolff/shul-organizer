'use strict'

const express = require('express');
const fs = require('fs');
const app = express();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
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

function hashPassword (password) {
  return bcrypt.hashSync(password, 10);
};

app.get('/', (req, res) => {
  initialize();
  res.status(200).sendFile(__dirname + '/public/index.html');
});

// **********************************
//    user endpoints
// **********************************

// --------------
//   GET
// --------------

// get user by ID
app.get('/user-byid/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then((users)=>{
      res.status(201).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong with GET_User_by_ID'});
    });
});

// check if user already exists
app.get('/user/:email', (req, res) => {
  User
  .find({email: req.params.email})
  .count()
  .then(count => {
            if (count > 0) {
                res.status(207).json({error: {type: 'user', msg: 'Username already taken'} });
            }
            else
              // If there is no existing user, return 200
              res.status(200).json({message: 'User is not registered'});
  })
  .catch(err => {
    res.status(500).json({code: 500, message: 'Internal server error'});
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

app.post('/user-login/', (req, res) => {
  User
    .findOne({email: req.body.emailIn})
    .then(function(user) {
      if ( user.validatePassword(req.body.pwIn) ) {
        res.status(201).json(user.apiRepr());
      }
      else {
        res.status(206).json({error: {type: 'password', msg: 'Password not valid for UserID'} });
      };
    })
    .catch(err => {
      console.error(err);
      res.status(208).json({error: {type: 'user', msg: 'User is not registered'} });
    });
});

app.post ('/newUserShul', (req, res) => {

    const requiredFields = ['email', 'pw', 'name', 'called'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        console.log('missing field: ' + missingField);
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    };

    let hashPW = hashPassword(req.body.pw);

    Shul
      .create({
        adminEmail: req.body.email,
        name: req.body.name,
        called: req.body.called
      })
      .then(newShul => {
        User
          .create({
            email: req.body.email,
            pw: hashPW,
            shulId: newShul.id,
            accessLevel: 3
          })
          .then((newUser)=>{
            let data = {'userId': newUser.id,
                        'email': newUser.email,
                        'accessLevel': newUser.accessLevel,
                        'shulId': newUser.shulId,
                        'shulName': newShul.name
                       };
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

app.get('/shul/:id', (req, res) => {
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

app.get('/member/:id', (req, res) => {
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

app.get('/services/:id', (req, res) => {
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
  const requiredFields = ['shulId', 'parsha', 'year', 'dateHebrew', 'dateEnglish'];
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
  let msg = `{ error: 'Path not found: \`${req.path}\`'}`;
  res.status(404).json(msg);
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
