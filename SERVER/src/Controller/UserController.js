import bcrypt from 'bcrypt';
import Utility from '../Utility/Uitility';
import db from '../Utility/Db';
import User from '../Model/User';

class UserController {
  static signUp(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      } else if (hash) {
        const values = [firstName, lastName, email.toLowerCase(), hash];
        db.addUser(values).then((rows) => {
          const { id } = rows[0];
          const user = new User(id, email.toLowerCase(), firstName, lastName, password);
          const token = Utility.getToken(user, '1s');
          res.status(201).json({
            status: 201,
            data: [{
              token,
            }],
          });
        }).catch((error) => {
          const errorMessage = `SERVER ERROR: ${error.message}`;
          Utility.handleError(res, errorMessage, 500);
        });
      } else {
        const errorMessage = 'SERVER ERROR';
        Utility.handleError(res, errorMessage, 500);
      }
    });
  }

  static login(req, res) {
    const { user } = req;
    UserController.user = user;
    const token = Utility.getToken(user);
    UserController.token = token;
    res.status(200).json({
      status: 200,
      data: [{
        token,
      }],
    });
  }

  static reset(req, res) {
    const { user } = req;
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      } else if (hash) {
        const values = [hash, user.getId()];
        db.reset(values).then(() => {
          const token = Utility.getToken(user, '1h');
          Utility.mail(user.getEmail(), token).then(() => {
            res.status(200).json({
              status: 200,
              data: [{
                message: 'Check your mail for Password Reset Confirmation link.',
              }],
            });
          }).catch((error) => {
            const errorMessage = `SERVER ERROR: ${error.message}`;
            Utility.handleError(res, errorMessage, 500);
          });
        }).catch((error) => {
          const errorMessage = `SERVER ERROR: ${error.message}`;
          Utility.handleError(res, errorMessage, 500);
        });
      } else {
        const errorMessage = 'SERVER ERROR';
        Utility.handleError(res, errorMessage, 500);
      }
    });
  }

  static updatePassword(req, res) {
    const userId = req.payload.id;
    db.updatePassword(userId).then(() => {
      res.status(200).json({
        status: 200,
        data: [{
          message: 'Password Reset Successful!',
        }],
      });
    }).catch(() => {
      const errorMessage = 'Invalid or Expired authorization token';
      Utility.handleError(res, errorMessage, 400);
    });
  }
}
export default UserController;
