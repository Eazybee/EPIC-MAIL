import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

const { expect } = chai;

describe('groups', () => {
  let obj;
  let authToken;

  describe('login', () => {
    beforeEach(() => {
      obj = {
        email: 'maryj@test.com',
        password: 'spiderman123',
      };
    });

    it('should return status 200', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(obj)
        .end((err, res) => {
          authToken = res.body.data[0].token;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('post', () => {
    describe('/groups', () => {
      obj = {
        name: 'Family',
      };
      it('should return a status of 400', (done) => {
        chai.request(app)
          .post('/api/v1/groups/')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });

  describe('get', () => {
    describe('/groups', () => {
      it('should return a status of 200', (done) => {
        chai.request(app)
          .get('/api/v1/groups/')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return only users group', (done) => {
        chai.request(app)
          .get('/api/v1/groups/')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            done();
          });
      });
    });
  });
});
