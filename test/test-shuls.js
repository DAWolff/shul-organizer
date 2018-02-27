const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {PORT, DATABASE_URL} = require('../config');
const {User} = require('../models/users-model.js');
const {Shul} = require('../models/shuls-model.js');
const {Member} = require('../models/members-model.js');
const {Services} = require('../models/services-model.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

app.use(bodyParser);
app.use(morgan('common'));
chai.use(chaiHttp);

var SHUL_ID = "";
var MEMBER_ID = "";
var SERVICES_ID = "";

describe('Homepage endpoint', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return homepage html and status code of 200', function() {
    let res;
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
  });
});


describe('USER and SHUL endpoints', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  let USER_ID = "";

  it('should add a User and Shul on POST', function() {
    const newItem = { 'email': 'test.email@gmail.com',
                      'pw': 'thisismypw1234',
                      'name': 'The New Shul',
                      'called': 'New Shul'
                    };
    return chai.request(app)
      .post('/newUserShul')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('userId', 'email', 'accessLevel', 'shulId', 'shulName');
        res.body.email.should.equal(newItem.email);
        res.body.shulName.should.equal(newItem.name);
        res.body.userId.should.not.be.null;
        res.body.shulId.should.not.be.null;
        res.body.accessLevel.should.not.be.null;
        SHUL_ID = res.body.shulId;
        USER_ID = res.body.userId;
      });
  });

  it('should GET a specific User by ID and PSWD', function() {
    let data = { "emailIn": 'test.email@gmail.com', "pwIn": 'thisismypw1234'};
    return chai.request(app)
      .post('/user-login/')
      .send(data)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'schemaType', 'email', 'shulId', 'accessLevel');
        res.body.id.should.equal(USER_ID);
        res.body.shulId.should.equal(SHUL_ID);
        res.body.schemaType.should.equal('user');
        res.body.email.should.equal(data.emailIn);
        res.body.accessLevel.should.not.be.null;
      });
  });

  it('should list all Users on GET', function() {
    return chai.request(app)
      .get('/user-all')
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['schemaType', 'email', 'pw', 'shulId', 'accessLevel'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should delete a User by ID', function() {
    return chai.request(app)
      .delete(`/user/${USER_ID}`)
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should list all Shuls on GET', function() {
    return chai.request(app)
      .get('/shul-all')
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['schemaType', 'adminEmail', 'name', 'called'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should list all "public" Shuls on GET', function() {
    return chai.request(app)
      .get('/shul-all-public')
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        const expectedKeys = ['schemaType', 'adminEmail', 'name', 'called'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

});


describe('MEMBER endpoints', function() {
  // test strategy:
  //   1. POST a new Member using new Shul added above
  //   2. Get all members for that Shul (should be only 1)
  //   3. Get all members for all Shuls (should be at least 1)
  //   4. Update the new member with put and check update worked
  //   5. Get the new member by ID
  //   6. Delete the new member by ID

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should add a Member on POST', function() {
    const newItem = {
      'schemaType': 'member',
      'shulId': `${SHUL_ID}`,
      'familyName': 'Goldberger',
      'hebrewNameFull': 'Gershon Mendel',
      'englishName': 'Gary Goldberger',
      'called': 'Goldfinger',
      'regular': false
    };
    return chai.request(app)
      .post('/member')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('schemaType', 'shulId', 'familyName', 'hebrewNameFull', 'englishName', 'called', 'regular');
        res.body.schemaType.should.equal(newItem.schemaType);
        res.body.shulId.should.equal(newItem.shulId);
        res.body.familyName.should.equal(newItem.familyName);
        res.body.hebrewNameFull.should.equal(newItem.hebrewNameFull);
        res.body.englishName.should.equal(newItem.englishName);
        res.body.called.should.equal(newItem.called);
        res.body.regular.should.equal(newItem.regular);
        MEMBER_ID = res.body._id;
      });
  });

  it('should list all Members with any ShulId', function() {
    return chai.request(app)
      .get(`/member-all`)
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['schemaType', 'shulId', 'familyName', 'hebrewNameFull', 'englishName', 'called'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should list one Member (added above) on GET, with ShulId', function() {
    return chai.request(app)
      .get(`/member-all/${SHUL_ID}`)
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        res.body[0]._id.should.equal(MEMBER_ID);
        const expectedKeys = ['schemaType', 'shulId', 'familyName', 'hebrewNameFull', 'englishName', 'called'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should update Member on PUT', function() {
    const updateData = {
      hebrewNameFull: 'Gershon Menachem Mendel',
      regular: true
    };
    return chai.request(app)
      .put(`/member/${MEMBER_ID}`)
      .send(updateData)
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should GET a Member with Member ID', function() {
    return chai.request(app)
      .get(`/member/${MEMBER_ID}`)
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('schemaType', 'shulId', 'familyName', 'hebrewNameFull', 'englishName', 'called', 'regular');
        res.body.hebrewNameFull.should.equal('Gershon Menachem Mendel');
        res.body.regular.should.equal(true);
      });
  });

  it('should delete a Member by ID', function() {
    return chai.request(app)
      .delete(`/member/${MEMBER_ID}`)
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});


describe('SERVICES endpoints', function() {
  // test strategy:
  //   1. POST a new Services Document using new Shul added above
  //   2. Get all Services for that Shul (should be only 1)
  //   3. Get all Services for all Shuls (should be at least 1)
  //   4. Update the new Service with put and check update worked
  //   5. Get the new service by ID
  //   6. Delete the new service by ID

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should add a Services Document on POST', function() {
    const newItem = {
      'schemaType': 'services',
      'shulId': `${SHUL_ID}`,
      'parsha': 'Bereishis',
      'year': '2817',
      'dateHebrew': '8 Cheshvan, 2018',
      'dateEnglish': 'October 27, 2018',
      'speaker': 'Yossi Jacobson'
    };
    return chai.request(app)
      .post('/services')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('schemaType', 'shulId', 'parsha', 'year', 'dateHebrew', 'dateEnglish', 'speaker');
        res.body.schemaType.should.equal(newItem.schemaType);
        res.body.shulId.should.equal(newItem.shulId);
        res.body.parsha.should.equal(newItem.parsha);
        res.body.year.should.equal(newItem.year);
        res.body.dateHebrew.should.equal(newItem.dateHebrew);
        res.body.dateEnglish.should.equal(newItem.dateEnglish);
        res.body.speaker.should.equal(newItem.speaker);
        SERVICES_ID = res.body._id;
      });
  });

  it('should list all Services with any ShulId', function() {
    return chai.request(app)
      .get(`/services-all`)
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['schemaType', 'shulId', 'parsha', 'year', 'dateHebrew', 'dateEnglish', 'speaker'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should list one Services (added above) on GET, with ShulId', function() {
    return chai.request(app)
      .get(`/services-all/${SHUL_ID}`)
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        res.body[0]._id.should.equal(SERVICES_ID);
        const expectedKeys = ['schemaType', 'shulId', 'parsha', 'year', 'dateHebrew', 'dateEnglish', 'speaker'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should update Services on PUT', function() {
    const updateData = {
      year: '2018',
      speaker: 'Simon Jacobson'
    };
    return chai.request(app)
      .put(`/services/${SERVICES_ID}`)
      .send(updateData)
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should GET a Services with Services ID', function() {
    return chai.request(app)
      .get(`/services/${SERVICES_ID}`)
      .then(function(res) {
        console.log("res body = ", JSON.stringify(res.body));
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('schemaType', 'shulId', 'parsha', 'year', 'dateHebrew', 'dateEnglish', 'speaker');
        res.body.year.should.equal('2018');
        res.body.speaker.should.equal('Simon Jacobson');
      });
  });

  it('should delete a Services by ID', function() {
    return chai.request(app)
      .delete(`/services/${SERVICES_ID}`)
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});


describe('Delete test Shul', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should delete a Shul by ID', function() {
    return chai.request(app)
      .delete(`/shul/${SHUL_ID}`)
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
