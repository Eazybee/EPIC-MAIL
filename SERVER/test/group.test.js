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
      beforeEach(() => {
        obj = {
          name: 'friend',
        };
      });
      it('should return a status of 201', (done) => {
        chai.request(app)
          .post('/api/v1/groups')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .post('/api/v1/groups')
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

      it('should return object with property status and data', (done) => {
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

  describe('post', () => {
    describe('/groups/<group-id>/users/', () => {
      beforeEach(() => {
        obj = {
          userId: 2,
        };
      });
      it('should return a status of 201', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/users')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .post('/api/v1/groups/6/users')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/users')
          .set('authorization', authToken)
          .send({ userId: 9 })
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return a status of 201', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/users')
          .set('authorization', authToken)
          .send({ userId: 1 })
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
    });

    describe('/groups/<group-id>/messages', () => {
      before(() => {
        obj = {
          subject: 'EKALE',
          message: 'It means good evening',
        };
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/messages/')
          .set('authorization', authToken)
          .send({
            subject: 'EKALE',
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return a status of 201', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/messages/')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .post('/api/v1/groups/8/messages/')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });

  describe('patch', () => {
    describe('/groups/<group-id>/name', () => {
      it('should return a status of 200', (done) => {
        obj = {
          name: 'Family',
        };
        chai.request(app)
          .patch('/api/v1/groups/1/name')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return object with property status and data', (done) => {
        obj = {
          name: 'Goons',
        };
        chai.request(app)
          .patch('/api/v1/groups/1/name')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            done();
          });
      });

      it('should return a status of 404', (done) => {
        chai.request(app)
          .patch('/api/v1/groups/2/name')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body).to.have.status(404);
            done();
          });
      });
    });
  });

  describe('delete', () => {
    describe('/groups/<group-id>/users/<user-id>', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1/users/2')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return status 400', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1/users/2')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return status 400', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/3/users/2')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
    });

    describe('/groups/<group-id>', () => {
      it('should return a status of 200', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return a status of 404', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });
});
