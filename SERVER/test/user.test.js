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

      it('should not signup with same mail adrress more than once', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send(obj)
          .end((err, res) => {
            expect(res).to.have.status(409);
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
    });
  });
});
