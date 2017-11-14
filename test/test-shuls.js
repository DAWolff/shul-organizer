const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const {app, closeServer, runServer} = require('../server');

chai.use(chaiHttp);

describe('GET endpoint', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return html and status code of 200', function() {
    let res;
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.html;
      })
    });
});
