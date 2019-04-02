import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Model/User';
import db from '../Utility/Db';
import Utility from '../Utility/Uitility';
import UserController from '../Controller/UserController';

class Validate {
  static isLoggedIn(req, res, next) {
    const token = req.headers.authorization;
    if (!UserController.user) {
      const errorMessage = 'User is not logged in';
      Utility.handleError(res, errorMessage, 401);
    } else if (!token) {
      const errorMessage = 'Authorization token required';
      Utility.handleError(res, errorMessage, 401);
    } else {
      jwt.verify(token, process.env.JWT_PRIVATE_SECRET, (err, payload) => {
        if (err) {
          const errorMessage = 'Invalid authorization token';
          Utility.handleError(res, errorMessage, 401);
        }
        if (payload) {
          const {
            id, email, firstName, lastName, password,
          } = payload.payload;
          UserController.user = new User(id, email, firstName, lastName, password);
          next();
        }
      });
    }
  }

  static signup(req, res, next) {
    db.getUsers().then((users) => {
      const userExist = users.some(user => user.email === req.body.email.toLowerCase());
      const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
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
        Utility.handleError(res, errorMessage, 409);
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
    } else {
      db.getUsers().then((users) => {
        let user = users.find(dbuser => dbuser.email === req.body.email.toLowerCase());
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              const errorMessage = 'Unauthorized: Invalid Credentials';
              Utility.handleError(res, errorMessage, 401);
            } else if (result) {
              const {
                id, email, password,
              } = user;
              const firstName = user.first_name;
              const lastName = user.last_name;
              user = new User(id, email.toLowerCase(), firstName, lastName, password);
              req.user = user;
              next();
            } else {
              const errorMessage = 'Unauthorized: Invalid Credentials';
              Utility.handleError(res, errorMessage, 401);
            }
          });
        } else {
          const errorMessage = 'Unauthorized: Invalid Credentials';
          Utility.handleError(res, errorMessage, 401);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static sendMail(req, res, next) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      receiverEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      const { receiverEmail } = req.body;
      db.getUserId(receiverEmail).then((rows) => {
        if (rows.length === 1) {
          req.body.receiverId = rows[0].id;
          next();
        } else {
          const errorMessage = `User with email ${receiverEmail} does not exist!`;
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
      receiverEmail: Joi.string().email({ minDomainAtoms: 2 }),
      id: Joi.number(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else if (req.body.receiverEmail || req.body.id) {
      const { receiverEmail } = req.body;
      const msgId = req.body.id;

      if (msgId) {
        db.getMessages(msgId, 'draft', UserController.user.getId()).then((rows) => {
          if (rows.length === 1) {
            if (receiverEmail) {
              db.getUserId(receiverEmail).then((rows2) => {
                if (rows2.length === 1) {
                  req.body.receiverId = rows2[0].id;
                  next();
                } else {
                  const errorMessage = `User with email ${receiverEmail} does not exist!`;
                  Utility.handleError(res, errorMessage, 400);
                }
              });
            } else {
              next();
            }
          } else {
            const errorMessage = 'Draft message does not exist!';
            Utility.handleError(res, errorMessage, 400);
          }
        }).catch((err) => {
          const errorMessage = `SERVER ERROR: ${err.message}`;
          Utility.handleError(res, errorMessage, 500);
        });
      } else if (receiverEmail) {
        db.getUserId(receiverEmail).then((rows) => {
          if (rows.length === 1) {
            req.body.receiverId = rows[0].id;
            next();
          } else {
            const errorMessage = `User with email ${receiverEmail} does not exist!`;
            Utility.handleError(res, errorMessage, 400);
          }
        }).catch((err) => {
          const errorMessage = `SERVER ERROR: ${err.message}`;
          Utility.handleError(res, errorMessage, 500);
        });
      }
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
      receiverEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) { // if schema exist
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      const { receiverEmail } = req.body;
      db.getUserId(receiverEmail).then((rows) => {
        if (rows.length === 1) {
          req.body.receiverId = rows[0].id;
          const draftMsgId = req.body.id;
          db.getDraftId(draftMsgId, UserController.user.getId()).then((rows2) => {
            if (rows2.length === 1) {
              next();
            } else {
              const errorMessage = 'Draft message does not exist!';
              Utility.handleError(res, errorMessage, 400);
            }
          });
        } else {
          const errorMessage = `User with email ${receiverEmail} does not exist!`;
          Utility.handleError(res, errorMessage, 400);
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
      const errorMessage = '\'id\' must be a number';
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
            const errorMessage = 'Message does not exist!';
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

  static sentMailId(req, res, next) {
    const mailId = parseInt(req.params.id, 10);
    const schema = Joi.number().required();
    const { error } = Joi.validate(mailId, schema);
    if (error) {
      const errorMessage = '\'id\' must be a number';
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getMessages(mailId, 'sent', UserController.user.getId()).then((rows) => {
        if (rows.length === 1) { //  Checking if mail exist
          req.rows = rows;
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

  static deleteWithId(req, res, next, table) {
    const mailId = parseInt(req.params.id, 10);
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const { error } = Joi.validate(req.params, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getMessages(mailId, table, UserController.user.getId()).then((rows) => {
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

  static deleteInboxWithId(req, res, next) {
    Validate.deleteWithId(req, res, next, 'deleteInbox');
  }

  static deleteSentWithId(req, res, next) {
    Validate.deleteWithId(req, res, next, 'deleteSent');
  }

  static deleteDrafttWithId(req, res, next) {
    Validate.deleteWithId(req, res, next, 'deleteDraft');
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

  static updateGroupName(req, res, next) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const schema2 = Joi.object().keys({
      name: Joi.string().required(),
    });
    const { error } = Joi.validate(req.params, schema);
    const error2 = Joi.validate(req.body, schema2);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else if (error2.error) {
      const errorMessage = error2.error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getGroups(UserController.user.getId()).then((groups) => {
        const groupExist = groups.find(group => group.id === parseInt(req.params.id, 10));
        if (groupExist) {
          const sameName = groups.some(group => group.name === req.body.name
            && group.id !== groupExist.id);
          if (sameName) {
            const errorMessage = 'Another group with same name exist';
            Utility.handleError(res, errorMessage, 400);
          } else {
            next();
          }
        } else {
          const errorMessage = 'Group with the id does not exist';
          Utility.handleError(res, errorMessage, 404);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static deleteGroup(req, res, next) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const { error } = Joi.validate(req.params, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getGroups().then((allGroups) => {
        let groupExist = allGroups.find(group => group.id === parseInt(req.params.id, 10));
        if (groupExist) {
          db.getGroups(UserController.user.getId()).then((groups) => {
            groupExist = groups.find(group => group.id === parseInt(req.params.id, 10));
            if (groupExist) {
              next();
            } else {
              const errorMessage = 'Only group owner can delete a group';
              Utility.handleError(res, errorMessage, 404);
            }
          });
        } else {
          const errorMessage = 'Group with the id does not exist';
          Utility.handleError(res, errorMessage, 404);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static addGroupMember(req, res, next) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const schema2 = Joi.object().keys({
      userEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
    });
    const { error } = Joi.validate(req.params, schema);
    const error2 = Joi.validate(req.body, schema2);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else if (error2.error) {
      const errorMessage = error2.error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getGroups().then((allGroups) => {
        let groupExist = allGroups.find(group => group.id === parseInt(req.params.id, 10));
        if (groupExist) {
          db.getGroups(UserController.user.getId()).then((groups) => {
            groupExist = groups.find(group => group.id === parseInt(req.params.id, 10));
            if (groupExist) {
              const { userEmail } = req.body;
              db.getUserId(userEmail).then((rows) => {
                if (rows.length === 1) {
                  req.body.userId = rows[0].id;
                  next();
                } else {
                  const errorMessage = `User with email ${userEmail} does not exist!`;
                  Utility.handleError(res, errorMessage, 400);
                }
              }).catch((err) => {
                const errorMessage = `SERVER ERROR: ${err.message}`;
                Utility.handleError(res, errorMessage, 500);
              });
            } else {
              const errorMessage = 'Only Group owners are allowed to add members';
              Utility.handleError(res, errorMessage, 400);
            }
          });
        } else {
          const errorMessage = 'Group with the id does not exist';
          Utility.handleError(res, errorMessage, 400);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static deleteGroupMember(req, res, next) {
    const schema = Joi.object().keys({
      groupId: Joi.number().required(),
      userId: Joi.number().required(),
    });
    const { error } = Joi.validate(req.params, schema);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      const groupId = parseInt(req.params.groupId, 10);
      db.getGroups().then((allGroups) => {
        let groupExist = allGroups.find(group => group.id === groupId);
        if (groupExist) {
          db.getGroups(UserController.user.getId()).then((groups) => {
            groupExist = groups.find(group => group.id === groupId);
            if (groupExist) {
              const userId = parseInt(req.params.userId, 10);
              db.getGroupMember(groupId, userId).then((rows) => {
                if (rows.length === 1) {
                  next();
                } else {
                  const errorMessage = 'User with this id does not exist in this group';
                  Utility.handleError(res, errorMessage, 400);
                }
              });
            } else {
              const errorMessage = 'Only group owner can delete group member';
              Utility.handleError(res, errorMessage, 400);
            }
          });
        } else {
          const errorMessage = 'Group with this id does not exist';
          Utility.handleError(res, errorMessage, 400);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }

  static messageGroup(req, res, next) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const schema2 = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
    });
    const { error } = Joi.validate(req.params, schema);
    const error2 = Joi.validate(req.body, schema2);
    if (error) {
      const errorMessage = error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else if (error2.error) {
      const errorMessage = error2.error.details[0].message;
      Utility.handleError(res, errorMessage, 400);
    } else {
      db.getAllGroups(UserController.user.getId()).then((groups) => {
        const groupId = parseInt(req.params.id, 10);
        const groupExist = groups.find(group => group.group_id === groupId);
        if (groupExist) {
          db.getGroupMember(groupId).then((rows) => {
            if (rows.length > 0) {
              req.members = rows;
              next();
            } else {
              const errorMessage = 'Sending message to an empty group';
              Utility.handleError(res, errorMessage, 400);
            }
          });
        } else {
          const errorMessage = 'Group with the id does not exist';
          Utility.handleError(res, errorMessage, 400);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    }
  }
}
export default Validate;
