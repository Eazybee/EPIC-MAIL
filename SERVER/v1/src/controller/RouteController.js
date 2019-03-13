import Joi from 'joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Message from '../model/Message';
import users from '../model/Database';
import User from '../model/User';

dotenv.config();

class RouteController {
  static handleError(res, err, status = 400) {
    res.status(status).send({
      status,
      error: err.message,
    });
  }

  static validateLogin(req, res, next) {
    if (RouteController.user) {
    //  Get auth header value
      const bearerHeader = req.headers.authorization;
      if (bearerHeader && RouteController.token === bearerHeader) {
        req.token = bearerHeader;
        next();
      } else {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized',
      });
    }
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
        error: 'Password does not match',
      });
    }
    const userExist = User.getUsers().some(user => user.getEmail() === req.body.email);
    if (userExist) {
      return res.status(400).json({
        status: 400,
        error: 'User with this email exist',
      });
    }


    const newUser = new User(req.body.email,
      req.body.firstName, req.body.lastName, req.body.password);
    users.push(newUser);
    return jwt.sign({ newUser }, process.env.JWT_SECRET, (err, token) => res.status(201).json({
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
      jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
        RouteController.token = token;
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
        error: 'Unauthorized',
      });
    }
  }

  static saveMail(req, res) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      receiverId: Joi.string(),
      toUserId: Joi.number(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = new Error(error.details[0].message);
      RouteController.handleError(res, errorMessage, 400);
    }
    try {
      const mail = RouteController.user.createMail({
        subject: req.body.subject,
        message: req.body.message,
        receiverId: req.body.receiverId,
      });

      return {
        status: 201,
        data: [{
          id: mail.getId(),
          createdOn: mail.getCreationDateTime(),
          subject: mail.getSubject(),
          message: mail.getMessage(),
          parentMessageId: mail.getParentMessageId(),
          status: mail.getStatus(),
        }],
      };
    } catch (err) {
      return RouteController.handleError(res, err, 400);
    }
  }

  static sendDraftUtility(req, res) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
      parentMessageId: Joi.number(),
      toUserId: Joi.number().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      RouteController.handleError(res, new Error(error.details[0].message), 400);
    }

    try {
      const mail = Message.getMails(parseInt(req.body.id, 10))[0];
      mail.setSubject(req.body.subject);
      mail.setMessage(req.body.message);

      RouteController.user.sendMail({
        message: mail,
        toUserId: parseInt(req.body.toUserId, 10),
      });
      const [mailObj] = Message.getMails(req.body.id);
      return {
        status: 201,
        data: [{
          id: mailObj.getId(),
          createdOn: mailObj.getCreationDateTime(),
          subject: mailObj.getSubject(),
          message: mailObj.getMessage(),
          parentMessageId: mailObj.getParentMessageId(),
          status: mailObj.getStatus(),
        }],
      };
    } catch (err) {
      return RouteController.handleError(res, err, 404);
    }
  }

  static getSentMail(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        res.status(200).json({
          status: 200,
          data: RouteController.user.getSentMail(),
        });
      }
    });
  }

  static deleteMail(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        const schema = Joi.number().required();
        const { error } = Joi.validate(req.params.id, schema);
        if (error) {
          RouteController.handleError(res, new Error(error.details[0].message), 400);
        }
        const mailId = parseInt(req.params.id, 10);
        try {
          // Checking if mail exist and return message
          const mailMessage = Message.getMails(mailId)[0].getMessage();
          // Delete mail
          User.deleteMail(mailId);
          res.status(200).json({
            status: 200,
            data: [{
              message: mailMessage,
            }],
          });
        } catch (er) {
          RouteController.handleError(res, new Error(er.message), 404);
        }
      }
    });
  }

  static saveDraft(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        res.status(201).send(RouteController.saveMail(req, res));
      }
    });
  }

  static sendDraft(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        res.status(201).json(RouteController.sendDraftUtility(req, res));
      }
    });
  }

  static message(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        const schema = Joi.object().keys({
          subject: Joi.string().required(),
          message: Joi.string().required(),
          parentMessageId: Joi.number(),
          toUserId: Joi.number().required(),
        });
        const { error } = Joi.validate(req.body, schema);
        if (error) {
          RouteController.handleError(res, new Error(error.details[0].message), 400);
        } else {
        // Save the mail
          const savedMail = RouteController.saveMail(req, res);

          // Send the mail
          req.body.id = savedMail.data[0].id;
          const sentMail = RouteController.sendDraftUtility(req, res);
          res.status(201).json(sentMail);
        }
      }
    });
  }

  static getMailId(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        try {
          res.status(200).json({
            status: 200,
            data: Message.getMails(parseInt(req.params.id, 10)),
          });
        } catch (er) {
          res.status(404).json({
            status: 404,
            error: er.message,
          });
        }
      }
    });
  }

  static getInbox(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {

        res.status(200).json({
          status: 200,
          data: RouteController.user.inbox(),
        });
      }
    });
  }

  static getReadInbox(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        res.status(200).json({
          status: 200,
          data: RouteController.user.readInbox(),
        });
      }
    });
  }

  static getUnreadInbox(req, res) {
    jwt.verify(req.token, 'Andela42', (err) => {
      if (err) {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized',
        });
      } else {
        res.status(200).json({
          status: 200,
          data: RouteController.user.unReadInbox(),
        });
      }
    });
  }
}
RouteController.user = null;
RouteController.token = null;
export default RouteController;
