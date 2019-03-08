import Joi from 'joi';
import jwt from 'jsonwebtoken';
import users from '../model/Database';
import User from '../model/User';

class RouteController {
  static handleError(res, err, status = 400) {
    res.status(status).send({
      status,
      data: err.message,
    });
  }

  static validateLogin(res) {
    return false;
  }

  static signUp(req, res) {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      rePassword: Joi.string().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      return RouteController.handleError(res, new Error(error.details[0].message), 400);
    }
    if (req.body.password !== req.body.rePassword) {
      return res.status(400).json({
        status: 400,
        data: 'Password does not match',
      });
    }
    const userExist = User.getUsers().some(user => user.getEmail() === req.body.email);
    if (userExist) {
      return res.status(400).json({
        status: 400,
        data: 'User with this email exist',
      });
    }


    const newUser = new User(req.body.email,
      req.body.firstName, req.body.lastName, req.body.password);
    users.push(newUser);
    return jwt.sign({ newUser }, 'Andela42', (err, token) => res.status(201).json({
      status: 201,
      data: [{
        token,
      }],
    }));
  }

  static login(req, res) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      RouteController.handleError(res, new Error(error.details[0].message), 400);
    }

    const user = users.find(dbuser => (dbuser.getEmail() === req.body.email)
    && (dbuser.getPassword() === req.body.password));

    if (user) {
      RouteController.user = user;
      jwt.sign({ user }, 'Andela42', (err, token) => {
        res.status(200).json({
          status: 200,
          data: [{
            token,
          }],
        });
      });
    } else {
      res.status(401).json({
        status: 401,
        data: 'Unauthorized',
      });
    }
  }

  static saveMail(req, res) {
    return false;
  }

  static sendDraft(req, res) {
    return false;
  }

  static saveAndSend(req, res) {
    return false;
  }

  static deletMail(req, res) {
    return false;
  }

  static message(req, res) {
    return false;
  }

  static getMailId(req, res) {
    return false;
  }

  static getInbox(req, res) {
    return false;
  }

  static getReadInbox(req, res) {
    return false;
  }

  static getUnreadInbox(req, res) {
    return false;
  }
}
RouteController.user = null;
export default RouteController;
