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
      it('should return status 201', (done) => { //  testing for saving message as draft
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
      it('should return status of message as draft', (done) => { //  testing for saving message as draft
        obj = {
          subject: 'WOW',
          message: 'you won again',
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

      it('should return status 200', (done) => { //  testing for sending draft
        obj = {
          id: draftId1,
          subject: 'Holla',
          message: 'you won again',
          receiverId: 1,
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

      it('should return status of message as sent', (done) => { //  testing for sending draft
        obj = {
          id: draftId2,
          subject: 'Holla',
          message: 'you won again',
          receiverId: 2,
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

    describe('/api/v1/messages/6', () => {
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

      // it('should return mail of id 6', (done) => {
      //   chai.request(app)
      //     .get('/api/v1/messages/6')
      //     .set('authorization', authToken)
      //     .end((err, res) => {
      //       expect(res.body.data[0].id).to.equal(6);
      //       done();
      //     });
      // });
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
  });

  describe('delete', () => {
    describe('/api/v1/messages/1', () => {
      it('should return status 204', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/1')
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
