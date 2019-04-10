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
      const values = [firstName, lastName, email.toLowerCase(), hash, 'user'];
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
        Utility.handleError(res, errorMessage, 400);
      });
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
}
export default UserController;
