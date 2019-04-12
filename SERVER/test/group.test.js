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
            expect(res).to.have.status(409);
            done();
          });
      });
    });

    describe('/groups/<group-id>/users/', () => {
      beforeEach(() => {
        obj = {
          userEmail: 'ayomipo@test.com',
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
      it('should return a status of 400, Member Exist', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/users')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return a status of 400, Wrong Group', (done) => {
        chai.request(app)
          .post('/api/v1/groups/6/users')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return a status of 400, Wrong Email', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/users')
          .set('authorization', authToken)
          .send({
            userEmail: 'wrongEmail@test.com',
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return a status of 400, Required Field', (done) => {
        chai.request(app)
          .post('/api/v1/groups/1/users')
          .set('authorization', authToken)
          .send({ userId: 9 })
          .end((err, res) => {
            expect(res).to.have.status(400);
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

      it('should return a status of 400, Required Field', (done) => {
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

      it('should have status 401, Authorizaton Token Required', (done) => {
        chai.request(app)
          .get('/api/v1/groups/')
          .end((err, res) => {
            expect(res.body).to.have.status(401);
            done();
          });
      });
    });

    describe('/groups/:id', () => {
      it('should return a status of 200', (done) => {
        chai.request(app)
          .get('/api/v1/groups/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .get('/api/v1/groups/4')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .get('/api/v1/groups/a')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
    });
  });

  describe('put', () => {
    let draftId1;

    it('should return status 201', (done) => { // saving message as draft
      obj = {
        subject: 'WOW',
        message: 'you won again',
      };
      chai.request(app)
        .post('/api/v1/messages/draft')
        .set('authorization', authToken)
        .send(obj)
        .end((err, res) => {
          expect(res).to.have.status(201);
          draftId1 = res.body.data[0].id;
          done();
        });
    });
    describe('/groups/:groupId/messages', () => {
      it('should return status 400', (done) => {
        obj = {
          id: draftId1,
          subject: 'Arinola',
          message: 'iyawo mi owon',
        };
        chai.request(app)
          .put('/api/v1/groups/a/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status 400', (done) => {
        obj = {
          id: draftId1,
          subject: 'Arinola',
          message: 'iyawo mi owon',
        };
        chai.request(app)
          .put('/api/v1/groups/5/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status 200', (done) => {
        obj = {
          id: draftId1,
          subject: 'Arinola',
          message: 'iyawo mi owon',
        };
        chai.request(app)
          .put('/api/v1/groups/1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should return status 400', (done) => {
        obj = {
          id: draftId1,
          subject: 'Arinola',
          message: 'iyawo mi owon',
        };
        chai.request(app)
          .put('/api/v1/groups/1/messages')
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
    it('should return a status of 201', (done) => {
      obj = {
        name: 'Bootcamp',
      };
      chai.request(app)
        .post('/api/v1/groups')
        .set('authorization', authToken)
        .send(obj)
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
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

      it('should return a status of 409, Same Name', (done) => {
        obj = {
          name: 'Bootcamp',
        };
        chai.request(app)
          .patch('/api/v1/groups/1/name')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body).to.have.status(409);
            done();
          });
      });

      it('should return a status of 404, Group Owner', (done) => {
        chai.request(app)
          .patch('/api/v1/groups/3/name')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body).to.have.status(400);
            done();
          });
      });
    });
  });

  describe('delete', () => {
    describe('/groups/<group-id>/users/<user-id>', () => {
      it('should return status 204', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1/users/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should return status 400', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1/users/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return status 400, Invalid Group ID', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/3/users/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
    });

    describe('/groups/<group-id>', () => {
      it('should return a status of 204', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should return a status of 400', (done) => {
        chai.request(app)
          .delete('/api/v1/groups/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });
});
