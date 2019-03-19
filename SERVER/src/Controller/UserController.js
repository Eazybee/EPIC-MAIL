import Utility from '../Utility/Uitility';
import db from '../Utility/Db';

class UserController {
  static signUp(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;

    const values = [firstName, lastName, email, password, 'user'];

    db.addUser(values).then((row) => {
      if (row > 0) {
        const token = Utility.getToken(values);
        res.status(201).json({
          status: 201,
          data: [{
            token,
          }],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 400);
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
