import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/controller/route';
import users from '../src/model/Database';
import Message from '../src/model/Message';

const mary = users[2];
const ayo = users[0];
let authToken;
chai.use(chaiHttp);

const { expect } = chai;

describe('route', () => {
  let obj;

  describe('post', () => {
    describe('/auth/signup', () => {
      beforeEach(() => {
        obj = {
          email: 'andela@andela.com',
          firstName: 'Epic',
          lastName: 'Andela',
          password: 'epicTower',
          rePassword: 'epicTower',
        };
      });

      it('should return status 201', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });

      it('should have the following property: status, error', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(obj)
          .end((err, res) => {
            expect(res.body).to.have.property('error');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should not signup with same mail adrress more than once', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
    });

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

      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .send(obj)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });
    });

    describe('/messages', () => {
      it('should return status 201', (done) => { //  testing for saving and message...
        obj = {
          subject: 'Holla',
          message: 'you won again',
          toUserId: 2,
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
      it('should return status of message as sent', (done) => { //  testing for saving and message...
        obj = {
          subject: 'Holla',
          message: 'you won again',
          toUserId: 2,
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

    describe('/messages/save', () => {
      it('should return status 201', (done) => { //  testing for saving message as draft
        obj = {
          subject: 'WOW',
          message: 'you won again',
        };
        chai.request(app)
          .post('/api/v1/messages/save')
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
          .post('/api/v1/messages/save')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res.body.data[0].status).to.equal('draft');
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
              .every(message => message.status === 'sent'))
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

    describe('/api/v1/messages/1', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .get('/api/v1/messages/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .get('/api/v1/messages/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });

      it('should return mail of id 1', (done) => {
        chai.request(app)
          .get('/api/v1/messages/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data[0].id).to.equal(1);
            done();
          });
      });
    });
  });

  describe('put', () => {
    describe('/messages', () => {
      it('should return status 201', (done) => { //  testing for sending draft
        const sorryMsg = mary.createMail({// creating draft message
          subject: 'Sorry!',
          message: 'my cell phone has been stolen. i will ask john if he can borrow you his\' own',
        });

        obj = {
          id: sorryMsg.getId(),
          subject: 'Holla',
          message: 'you won again',
          toUserId: ayo.getId(),
        };
        chai.request(app)
          .put('/api/v1/messages')
          .set('authorization', authToken)
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });

      it('should return status of message as sent', (done) => { //  testing for sending draft
        const sorryMsg = mary.createMail({// creating draft message
          subject: 'Sorry!',
          message: 'my cell phone has been stolen. i will ask john if he can borrow you his\' own',
        });

        obj = {
          id: sorryMsg.getId(),
          subject: 'Holla',
          message: 'you won again',
          toUserId: ayo.getId(),
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
    describe('/api/v1/messages/3', () => {
      it('should return status 200', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/3')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should return deleted mails\'s message', (done) => {
        const mailMessage = Message.getMails(2)[0].getMessage();
        chai.request(app)
          .delete('/api/v1/messages/2')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body.data[0].message).to.equal(mailMessage);
            done();
          });
      });

      it('should have the following property: data, status', (done) => {
        chai.request(app)
          .delete('/api/v1/messages/1')
          .set('authorization', authToken)
          .end((err, res) => {
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('status');
            done();
          });
      });
    });
  });
});
