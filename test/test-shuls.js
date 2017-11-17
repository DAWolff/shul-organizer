const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const {app, closeServer, runServer} = require('../server');

chai.use(chaiHttp);

describe('GET endpoints', function() {

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

  it('should return Shul html and status code of 200', function() {
    let res;
    return chai.request(app)
      .get('/shul')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
  });

  it('should return Member html and status code of 200', function() {
    let res;
    return chai.request(app)
      .get('/member')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
  });

  it('should return Services html and status code of 200', function() {
    let res;
    return chai.request(app)
      .get('/services')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
  });
});
