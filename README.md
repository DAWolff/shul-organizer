## The Shul Organizer

Screen Shot:  https://www.flickr.com/photos/156091700@N03/39744894495/in/dateposted-public/

## Synopsis

The "Shul Organizer" enables a Gabbai (Synagogue sexton) to record important information needed to organize and run a Shul (Synagogue).  Data is kept in four collections:  
  1. The Shul - Official Name, address, Times of services, Shul announcements, Shul management
  2. The Members - Contact info, participation records, and occasions observed in a given Shul
  3. Services - What happened on a given Shabbat or Holiday in a given Shul - who got which honors, etc.   
  4. All registered Users, with encrypted passwords and access level.

To log in:

  * Register a new User/Shul on the landing page ('New User' button)
  * Log in with an existing user (can only update his own Shul):
        Email: george@gmail.com
        PW:    george
  * Log in using a super user's account (can view/update any shul):
        Email: daniel613@live.com
        PW:    daniel613

Note that anyone can view all "public" Shuls BEFORE logging in, by clicking the Shul icon.
(Member and Services data cannot be viewed without logging in).

## Notes

Responsive from 320px to 1600px.

## Technology

HTML, CSS, JavaScript, jQuery, Node.js, Express, MongoDb

## Code Example

Module:  server.js  (server side)
----------------------------------
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

Module:  index.js  (client side)
----------------------------------
function registerNewGabbaiAndShul(email, pw, shulName, shulCalled) {

  let route = '/newUserShul';
  let body = { 'email': email,
               'pw': pw,
               'name': shulName,
               'called': shulCalled };

  $.post(route, body, function ( data, status, xhr ) {
      console.log(data.userId + ' '
                + data.email + ' '
                + data.accessLevel + ' '
                + data.shulId + ' '
                + data.shulName )
      storage_data.user_email = data.email;
      storage_data.access_level = data.accessLevel;
      storage_data.logged_in = true;
      storage_data.user_id = data.userId;
      storage_data.shul_id = data.shulId;
      storage_data.shul_name = data.shulName;
      storage_data.action = 'update';
      storage_data.target = 'shul';
      setLocalStorage();
      window.location.href = 'shul-steps.html';
      })
  .fail(function(err) {
    // responseJSON   status
    console.log(err);
  });
}

// Display of data is handled in:  public/index.html/index.js
// Data is created and updated in:  public/xxxx-steps.html and public/xxxx-steps.js modules
// State is maintained via local storage  

## Motivation

To facilitate the running of a Shul by providing a database and CRUD operations on key data.

## Installation

Application:  https://fierce-tundra-73265.herokuapp.com

Code is at GitHub:
		 https://github.com/DAWolff/shul-organizer.git

## Tests

All CRUD operations are tested using Mocha and Chai.  

## Contributors

Created by Dennis Wolff
