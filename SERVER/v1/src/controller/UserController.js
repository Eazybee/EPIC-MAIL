import users from '../model/Database';
import User from '../model/User';
import Utility from './Uitility';


class UserController {
  static signUp(req, res) {
    const newUser = new User(req.body.email,
      req.body.firstName, req.body.lastName, req.body.password);

    const token = Utility.getToken(newUser);
    if (token) {
      users.push(newUser);
      res.status(201).json({
        status: 201,
        data: [{
          token,
        }],
      });
    } else {
      const errorMessage = 'Internal server error';
      Utility.handleError(res, errorMessage, 500);
    }
  }

  static login(req, res) {
    const { user } = req;
    UserController.user = user;
    const token = Utility.getToken(user);
    if (token) {
      UserController.token = token;
      res.status(200).json({
        status: 200,
        data: [{
          token,
        }],
      });
    } else {
      const errorMessage = 'Internal server error';
      Utility.handleError(res, errorMessage, 500);
    }
  }
}
export default UserController;
