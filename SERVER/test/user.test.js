import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

const { expect } = chai;

describe('user', () => {
  let obj;

  describe('post', () => {
    describe('/auth/signup', () => {
      beforeEach(() => {
        obj = {
          email: 'Iloriezekiel@beetechnology.com',
          firstName: 'Ezekiel',
          lastName: 'Ilori',
          password: 'bee',
          rePassword: 'bee',
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

      it('should have status 409, Email Exist', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
      });
      it('should have status 400, rePassword, Required Field', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send({
            email: 'Iloriezekiel@beetechnology.com',
            firstName: 'Ezekiel',
            lastName: 'Ilori',
            password: 'bee',
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      });
      it('should have status 400, Password does not match', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send({
            email: 'Iloriezekiel@beetechnology.com',
            firstName: 'Ezekiel',
            lastName: 'Ilori',
            password: 'bee',
            rePassword: 'eeb',
          })
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

      it('should have status 401, Wrong User', (done) => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'wronguser@test.com',
            password: 'spiderman123',
          })
          .end((err, res) => {
            expect(res.body).to.have.status(401);
            done();
          });
      });

      it('should have status 401, Wrong Password', (done) => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'maryj@test.com',
            password: 'wrongPassword123',
          })
          .end((err, res) => {
            expect(res.body).to.have.status(401);
            done();
          });
      });

      it('should have status 400, Require Field', (done) => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'maryj@test.com',
          })
          .end((err, res) => {
            expect(res.body).to.have.status(400);
            done();
          });
      });
    });
  });
});
