import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

let authToken;
chai.use(chaiHttp);

const { expect } = chai;

describe('Messages', () => {
  let obj;

  describe('/auth/login', () => {
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
    describe('/messages', () => {
      it('should return status 401, Authorization token required', (done) => {
        obj = {
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'johndoe@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages')
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(401);
            done();
          });
      });
      it('should return status 401, Invalid Authorization token', (done) => {
        obj = {
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'johndoe@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages')
          .set('authorization', 'nknkinifbihihn7y9893hbjb97g9b3jof87gbur78g')
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(401);
            done();
          });
      });
      it('should return status 400, Required Field', (done) => {
        obj = {
          subject: 'Holla',
          message: 'you won again',
        };
        chai.request(app)
          .post('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status 400, Wrong user email', (done) => {
        obj = {
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'wrongUser@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return status 201', (done) => {
        obj = {
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'johndoe@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
      it('should return status of message as sent', (done) => {
        obj = {
          subject: 'Howdy',
          message: 'how have you been',
          receiverEmail: 'ayomipo@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body.data[0].status).to.equal('sent');
            done();
          });
      });
    });

    describe('/messages/draft', () => {
      let draftId;
      it('should return status 400, Required Field', (done) => {
        obj = {
          subject: 'WOW',
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status 201', (done) => {
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
            done();
          });
      });
      it('should return status 201', (done) => {
        obj = {
          subject: 'WOW',
          message: 'you won again',
          receiverEmail: 'johndoe@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
      it('should return status 400, Wrong Email', (done) => {
        obj = {
          subject: 'WOW',
          message: 'you won again',
          receiverEmail: 'wrongEmail@test.com',
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status of message as draft', (done) => {
        obj = {
          subject: 'WOW',
          message: 'you won again',
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            draftId = res.body.data[0].id;
            expect(res.body.data[0].status).to.equal('draft');
            done();
          });
      });
      it('should return status of message as draft, Re-saving', (done) => {
        obj = {
          subject: 'Resaving a draft message',
          message: 'you won again',
          id: draftId,
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body.data[0].status).to.equal('draft');
            done();
          });
      });
      it('should return status 400, Wrong draft Id', (done) => {
        obj = {
          subject: 'Resaving a draft message',
          message: 'you won again',
          id: 2,
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status 400, wrong email address', (done) => {
        obj = {
          subject: 'Resaving a draft message',
          message: 'you won again',
          receiverEmail: 'wrongEmail@test.com',
          id: draftId,
        };
        chai.request(app)
          .post('/api/v1/messages/draft')
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
    describe('/api/v1/messages', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return logged-in user\'s inbox', (done) => {
        chai.request(app)
          .get('/api/v1/messages')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data
              .every(message => parseInt(message.receiverId, 10) === 3))
              .to.equal(true);
            done();
          });
      });
    });

    describe('/api/v1/messages/unread', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/unread')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/unread')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return logged-in user\'s unread inbox', (done) => {
        chai.request(app)
          .get('/api/v1/messages/unread')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data
              .every(message => message.status === 'unread'))
              .to.equal(true);
            done();
          });
      });
    });

    describe('/api/v1/messages/read', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/read')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/read')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return logged-in user\'s read inbox', (done) => {
        chai.request(app)
          .get('/api/v1/messages/read')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data
              .every(message => message.status === 'read'))
              .to.equal(true);
            done();
          });
      });
    });

    describe('/api/v1/messages/:id', () => {
      it('should return status 404', (done) => {
        chai.request(app)
          .get('/api/v1/messages/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/6')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/6')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return mail of id 6', (done) => {
        chai.request(app)
          .get('/api/v1/messages/6')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data[0].id).to.equal(1); //  resulting thread
            done();
          });
      });
    });

    describe('/api/v1/messages/sent ', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return only sent mail of user', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data.every(mail => parseInt(mail.senderId, 10) === 3)).to.equal(true);
            done();
          });
      });
    });

    describe('/api/v1/messages/sent/:1d ', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should have status 400, Required Feild', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent/a')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should have status 404, Message does not exist', (done) => {
        chai.request(app)
          .get('/api/v1/messages/sent/3')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
    });

    describe('/api/v1/messages/draft ', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/draft')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/draft')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return only sent mail of user', (done) => {
        chai.request(app)
          .get('/api/v1/messages/draft')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data.every(mail => parseInt(mail.senderId, 10) === 3)).to.equal(true);
            done();
          });
      });
    });
  });

  describe('put', () => {
    describe('/messages', () => {
      let draftId1;
      let draftId2;

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
            draftId2 = res.body.data[0].id;
            done();
          });
      });

      it('should return status 400, Wrong email', (done) => { //  testing for sending draft
        obj = {
          id: draftId1,
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'wrongEmail@test.com',
        };
        chai.request(app)
          .put('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should return status 400, Wrong Message Id', (done) => { //  testing for sending draft
        obj = {
          id: 2,
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'wrongEmail@test.com',
        };
        chai.request(app)
          .put('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });

      it('should return status 200', (done) => { //  testing for sending draft
        obj = {
          id: draftId1,
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'johndoe@test.com',
        };
        chai.request(app)
          .put('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return status of message as sent', (done) => {
        obj = {
          id: draftId2,
          subject: 'Holla',
          message: 'you won again',
          receiverEmail: 'ayomipo@test.com',
        };
        chai.request(app)
          .put('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body.data[0].status).to.equal('sent');
            done();
          });
      });
    });
  });

  describe('delete', () => {
    describe('/api/v1/messages/sent/:id', () => {
      it('should return status 204', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/sent/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should have status 404', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/sent/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.status(404);
            done();
          });
      });

      it('should have the following property: data, error', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/sent/3')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('status');
            done();
          });
      });
    });
    describe('/api/v1/messages/sent/:id/retract', () => {
      it('should return status 204', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/sent/2/retract')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should have status 404', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/sent/2/retract')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.status(404);
            done();
          });
      });

      it('should have the following property: data, error', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/sent/3/retract')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('status');
            done();
          });
      });
    });
    describe('/api/v1/messages/draft/:id', () => {
      it('should return status 204', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/draft/13')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should have status 404', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/draft/13')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.status(404);
            done();
          });
      });

      it('should have the following property: data, error', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/draft/9')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('status');
            done();
          });
      });
    });
    describe('/api/v1/messages/:id', () => {
      it('should return status 204', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/3')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });

      it('should have the following property: data, error', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('status');
            done();
          });
      });
    });
  });
});
