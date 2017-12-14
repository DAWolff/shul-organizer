'use strict'

var express = require('express');
var app = express();
app.use(express.static('public'));

const morgan = require('morgan');
app.use(morgan('common'));

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {User} = require('./models/users-model.js');
const {Shul} = require('./models/shuls-model.js');
const {Member} = require('./models/members-model.js');
const {Services} = require('./models/services-model.js');

app.get("/", (req, res) => {
  res.status(200)
  .sendFile(__dirname + '/public/index.html');
});

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// **********************************
// user endpoints
// **********************************
// email/pw/shulId/accessLevel

app.get("/user", (req, res) => {
  res.status(200)
  .sendFile(__dirname + '/public/index.html');
});

// check password validity on user collection
// if pw is good, return:
//  status of 201
//  user JSON (for accessLevel)
//  JSON of shul with shulId == shulId for user
//      .find({_id : ObjectId("59074c7c057aaffaafb119fb")});
app.get('/user-read/:email', (req, res) => {
  User
    .find({email: /email/})    // .find({email: /(req.params.email)/})
    .then(user => {
      res.json(user.map(usr => usr.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

//
// app.get('/posts/:id', (req, res) => {
//   User
//     .findById(req.params.id)
//     .then(post => res.json(post.apiRepr()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went horribly awry'});
//     });
// });
//
// app.post('/posts', (req, res) => {
//   const requiredFields = ['title', 'content', 'author'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//
//   User
//     .create({
//       title: req.body.title,
//       content: req.body.content,
//       author: req.body.author
//     })
//     .then(blogPost => res.status(201).json(blogPost.apiRepr()))
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({error: 'Something went wrong'});
//     });
//
// });
//
//
// app.delete('/posts/:id', (req, res) => {
//   User
//     .findByIdAndRemove(req.params.id)
//     .then(() => {
//       res.status(204).json({message: 'success'});
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went terribly wrong'});
//     });
// });
//
//
// app.put('/posts/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }
//
//   const updated = {};
//   const updateableFields = ['title', 'content', 'author'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });
//
//   User
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .then(updatedPost => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Something went wrong'}));
// });
//
//
// app.delete('/:id', (req, res) => {
//   User[s]???
//     .findByIdAndRemove(req.params.id)
//     .then(() => {
//       console.log(`Deleted blog post with id \`${req.params.ID}\``);
//       res.status(204).end();
//     });
// });
//
//

// **********************************
// shul endpoints
// **********************************

app.get("/shul-read", (req, res) => {
  res.status(200)
  .sendFile(__dirname + '/public/shul-read.html');
});

// **********************************
// member endpoints
// **********************************

app.get("/member-read", (req, res) => {
  res.status(200)
  .sendFile(__dirname + '/public/member-read.html');
});

app.get("/member-all", (req, res) => {
  res.status(200)
  .sendFile(__dirname + '/public/member-all.html');
});

// **********************************
// services endpoints
// **********************************

app.get("/services-read", (req, res) => {
  res.status(200)
  .sendFile(__dirname + '/public/services-read.html');
});



// ******************
// app.get('/posts', (req, res) => {
//   BlogPost
//     .find()
//     .then(posts => {
//       res.json(posts.map(post => post.apiRepr()));
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went terribly wrong'});
//     });
// });
//
// app.get('/posts/:id', (req, res) => {
//   BlogPost
//     .findById(req.params.id)
//     .then(post => res.json(post.apiRepr()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went horribly awry'});
//     });
// });
//
// app.post('/posts', (req, res) => {
//   const requiredFields = ['title', 'content', 'author'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//
//   BlogPost
//     .create({
//       title: req.body.title,
//       content: req.body.content,
//       author: req.body.author
//     })
//     .then(blogPost => res.status(201).json(blogPost.apiRepr()))
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({error: 'Something went wrong'});
//     });
//
// });
//
//
// app.delete('/posts/:id', (req, res) => {
//   BlogPost
//     .findByIdAndRemove(req.params.id)
//     .then(() => {
//       res.status(204).json({message: 'success'});
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'something went terribly wrong'});
//     });
// });
//
//
// app.put('/posts/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }
//
//   const updated = {};
//   const updateableFields = ['title', 'content', 'author'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });
//
//   BlogPost
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .then(updatedPost => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Something went wrong'}));
// });
//
//
// app.delete('/:id', (req, res) => {
//   BlogPosts
//     .findByIdAndRemove(req.params.id)
//     .then(() => {
//       console.log(`Deleted blog post with id \`${req.params.ID}\``);
//       res.status(204).end();
//     });
// });
//
//
// app.use('*', function(req, res) {
//   res.status(404).json({message: 'Not Found'});
// });
// ********************


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
