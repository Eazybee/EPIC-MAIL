import users from '../Database/Database';
import User from '../Model/User';
import Utility from '../Utility/Uitility';


class UserController {
  static signUp(req, res) {
    const newUser = new User(req.body.email,
      req.body.firstName, req.body.lastName, req.body.password);

    const token = Utility.getToken(newUser);
    users.push(newUser);
    res.status(201).json({
      status: 201,
      data: [{
        token,
      }],
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
