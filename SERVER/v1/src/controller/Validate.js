import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../model/User';
import users from '../model/Database';
import Utility from './Uitility';
import UserController from './UserController';
import Message from '../model/Message';

class Validate {
  static isLoggedIn(req, res, next) {
    const errorMessage = 'Unauthorized';
    const token = req.headers.authorization;
    if (UserController.user && token) {
      jwt.verify(token, process.env.JWT_PRIVATE_SECRET, (err) => {
        if (err) {
          Utility.handleError(res, errorMessage, 401);
        } else if (UserController.token === token) {
          next();
        } else {
          Utility.handleError(res, errorMessage, 401);
        }
      });
    } else {
      Utility.handleError(res, errorMessage, 401);
    }
  }

  static signup(req, res, next) {
    const userExist = User.getUsers().some(user => user.getEmail() === req.body.email);
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      rePassword: Joi.string().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else if (req.body.password !== req.body.rePassword) {
      const errorMessage = 'Password does not match';
      Utility.handleError(res, errorMessage, 400);
    } else if (userExist) {
      const errorMessage = 'User with this email exist';
      Utility.handleError(res, errorMessage, 400);
    } else {
      next();
    }
  }

  static login(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    }

    const user = users.find(dbuser => (dbuser.getEmail() === req.body.email)
    && (dbuser.getPassword() === req.body.password));

    if (!user) {
      const errorMessage = 'Unauthorized';
      Utility.handleError(res, errorMessage, 401);
    } else {
      req.user = user;
      next();
    }
  }

  static sendMail(req, res, next) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      parentMessageId: Joi.number(),
      toUserId: Joi.number().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      next();
    }
  }

  static saveDraft(req, res, next) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      receiverId: Joi.string(),
      toUserId: Joi.number(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      next();
    }
  }

  static sendDraft(req, res, next) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
      parentMessageId: Joi.number(),
      toUserId: Joi.number().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      try {
        const mail = Message.getMails(parseInt(req.body.id, 10))[0];
        if (mail.getStatus() !== 'draft') {
          const errorMessage = 'Message must be draft';
          Utility.handleError(res, errorMessage, 400);
        } else {
          next();
        }
      } catch (err) {
        Utility.handleError(res, err.message, 404);
      }
    }
  }

  static mailId(req, res, next) {
    const schema = Joi.number().required();
    const { error } = Joi.validate(req.params.id, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      const mailId = parseInt(req.params.id, 10);
      try {
        Message.getMails(mailId); //  Checking if mail exist
        next();
      } catch (err) {
        Utility.handleError(res, err.message, 404);
      }
    }
  }
}
export default Validate;
