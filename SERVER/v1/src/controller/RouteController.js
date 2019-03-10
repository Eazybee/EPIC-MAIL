import Joi from 'joi';
import jwt from 'jsonwebtoken';
import Message from '../model/Message';
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
    if (RouteController.user !== null) {
      return true;
    }
    res.status(401).json({
      status: 401,
      data: 'Unauthorized',
    });
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
    if (RouteController.validateLogin(res)) {
      const schema = Joi.object().keys({
        type: Joi.string().equal('save'),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        receiverId: Joi.string(),
        toUserId: Joi.number(),
      });
      const { error } = Joi.validate(req.body, schema);
      if (error) {
        RouteController.handleError(res, new Error(error.details[0].message), 400);
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
    return false;
  }

  static sendDraft(req, res) {
    if (RouteController.validateLogin(res)) {
      const schema = Joi.object().keys({
        type: Joi.string().equal('send').required(),
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
    return false;
  }

  static saveAndSend(req, res) {
    if (RouteController.validateLogin(res)) {
      const schema = Joi.object().keys({
        type: Joi.string().equal('saveAndSend').required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        parentMessageId: Joi.number(),
        toUserId: Joi.number().required(),
      });
      const { error } = Joi.validate(req.body, schema);
      if (error) {
        RouteController.handleError(res, new Error(error.details[0].message), 400);
      }

      // Save the mail
      req.body.type = 'save';
      const savedMail = RouteController.saveMail(req, res);

      // Send the mail
      req.body.type = 'send';
      req.body.id = savedMail.data[0].id;
      // req.body.id = receiverID;
      const sentMail = RouteController.sendDraft(req, res);
      return sentMail;
    }
    return false;
  }

  static deletMail(req, res) {
    if (RouteController.validateLogin(res)) {
      const schema = Joi.number().required();
      const { error } = Joi.validate(req.params.id, schema);
      if (error) {
        return RouteController.handleError(res, new Error(error.details[0].message), 400);
      }
      const mailId = parseInt(req.params.id, 10);
      try {
        // Checking if mail exist and return message
        const mailMessage = Message.getMails(mailId)[0].getMessage();
        // Delete mail
        User.deleteMail(mailId);
        return res.status(200).json({
          status: 200,
          data: [{
            message: mailMessage,
          }],
        });
      } catch (err) {
        return RouteController.handleError(res, new Error(err.message), 404);
      }
    }
    return false;
  }

  static message(req, res) {
    if (RouteController.validateLogin(res)) {
      if (req.body && req.body.type) {
        if (req.body.type === 'save') { // if it save post request
          res.status(201).send(RouteController.saveMail(req, res));
        } else if (req.body.type === 'send') {
          if (req.body.id) { //  If it has been saved as draft before
            res.status(201).json(RouteController.sendDraft(req, res));
          } else {
            RouteController.handleError(res, new Error('id is required'), 400);
          }
        } else if (req.body.type === 'saveAndSend') {
          res.status(201).json(RouteController.saveAndSend(req, res));
        } else {
          RouteController.handleError(res, new Error('type can only have value= "save" or value= "send"'), 400);
        }
      } else {
        RouteController.handleError(res, new Error('type is required'), 400);
      }
    }
  }

  static getMailId(req, res) {
    if (RouteController.validateLogin(res)) {
      try {
        res.status(200).json({
          status: 200,
          data: Message.getMails(parseInt(req.params.id, 10)),
        });
      } catch (er) {
        res.status(404).json({
          status: 404,
          data: er.message,
        });
      }
    }
  }

  static getInbox(req, res) {
    if (RouteController.validateLogin(res)) {
      res.status(200).json({
        status: 200,
        data: RouteController.user.inbox(),
      });
    }
  }

  static getReadInbox(req, res) {
    if (RouteController.validateLogin(res)) {
      res.status(200).json({
        status: 200,
        data: RouteController.user.readInbox(),
      });
    }
  }

  static getUnreadInbox(req, res) {
    if (RouteController.validateLogin(res)) {
      res.status(200).json({
        status: 200,
        data: RouteController.user.unReadInbox(),
      });
    }
  }
}
RouteController.user = null;
export default RouteController;
