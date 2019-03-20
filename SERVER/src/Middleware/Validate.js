import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../Model/User';
import db from '../Utility/Db';
import Utility from '../Utility/Uitility';
import UserController from '../Controller/UserController';

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
    db.getUsers().then((users) => {
      const userExist = users.some(user => user.email === req.body.email);
      const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
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
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static login(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    }

    db.getUsers().then((users) => {
      let user = users.find(dbuser => (dbuser.email === req.body.email)
          && (dbuser.password === req.body.password));
      if (!user) {
        const errorMessage = 'Unauthorized';
        Utility.handleError(res, errorMessage, 401);
      } else {
        const {
          id, email, password,
        } = user;
        const firstName = user.first_name;
        const lastName = user.last_name;
        user = new User(id, email, firstName, lastName, password);
        req.user = user;
        next();
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static sendMail(req, res, next) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      parentMessageId: Joi.number(),
      receiverId: Joi.number().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      const receiverId = parseInt(req.body.receiverId, 10);
      db.getUsers(receiverId).then((rows) => {
        if (rows.length === 1) {
          next();
        } else {
          const errorMessage = 'User with this receiver Id does not exist';
          Utility.handleError(res, errorMessage, 400);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static saveDraft(req, res, next) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      receiverId: Joi.number(),
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
      receiverId: Joi.number().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) { // if schema exist
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      const mailId = parseInt(req.body.id, 10);
      db.getMessages(mailId).then((rows) => {
        const [mail] = rows;
        if (mail) { // if mail exist
          if (mail.owner_id !== UserController.user.getId()) {
            // check if message belongs to the user
            const errorMessage = 'Unauthorized';
            Utility.handleError(res, errorMessage, 401);
          } else if (mail.status !== 'draft') { // check if it is a draft
            const errorMessage = 'Message must be draft';
            Utility.handleError(res, errorMessage, 400);
          } else {
            const userId = parseInt(req.body.receiverId, 10);
            db.getUsers(userId).then((rows2) => {
              if (rows2.length === 1) {
                next();
              } else {
                const errorMessage = 'User with this receiverId does not exist!';
                Utility.handleError(res, errorMessage, 400);
              }
            }).catch((err) => {
              const errorMessage = `SERVER ERROR: ${err.message}`;
              Utility.handleError(res, errorMessage, 500);
            });
          }
        } else {
          const errorMessage = 'Message does not exist!';
          Utility.handleError(res, errorMessage, 404);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static mailId(req, res, next) {
    const mailId = parseInt(req.params.id, 10) || parseInt(req.body.id, 10);
    const schema = Joi.number().required();
    const { error } = Joi.validate(mailId, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getMessages(mailId, 'inbox').then((rows) => {
        if (rows.length > 0) { //  Checking if mail exist
          const mail = rows[0];
          const receiverId = mail.receiver_id;
          const loggedInUser = UserController.user;

          if (loggedInUser.getId() === receiverId) {
            next();
          } else {
            const errorMessage = 'Unauthorized';
            Utility.handleError(res, errorMessage, 401);
          }
        } else {
          const errorMessage = 'Message does not exist!';
          Utility.handleError(res, errorMessage, 404);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static deleteMailId(req, res, next) {
    const mailId = parseInt(req.params.id, 10);
    const schema = Joi.number().required();
    const { error } = Joi.validate(mailId, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getMessages(mailId, 'delete', UserController.user.getId()).then((rows) => {
        const mail = rows.rows[0];
        if (mail) { //  Checking if mail exist
          req.deleteType = rows.deleteType;
          next();
        } else {
          const errorMessage = 'Message does not exist!';
          Utility.handleError(res, errorMessage, 404);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static createGroup(req, res, next) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getGroups(UserController.user.getId()).then((groups) => {
        if (groups.length > 0) {
          const groupExist = groups.some(group => group.name === req.body.name);
          if (groupExist) {
            const errorMessage = 'Group with the same name exist';
            Utility.handleError(res, errorMessage, 400);
          } else {
            next();
          }
        } else {
          next();
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static isAdmin(req, res, next) {
    db.getUsers(UserController.user.getId()).then((users) => {
      const user = users[0];
      if (user.status !== 'admin') {
        const errorMessage = 'Unauthorized';
        Utility.handleError(res, errorMessage, 401);
      } else {
        next();
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }
}
export default Validate;
