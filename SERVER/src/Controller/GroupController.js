import db from '../Utility/Db';
import Utility from '../Utility/Uitility';
import UserController from './UserController';

class GroupController {
  static createGroup(req, res) {
    const values = [
      UserController.user.getId(),
      req.body.name,
    ];
    db.createGroup(values).then((rows) => {
      if (rows.length === 1) {
        const group = rows[0];
        res.status(201).json({
          status: 201,
          data: [{
            id: group.id,
            name: group.name,
            role: 'admin',
          }],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getGroups(req, res) {
    db.getGroups(UserController.user.getId()).then((groups) => {
      const data = groups.map(group => ({
        id: group.id,
        name: group.name,
        role: 'admin',
      }));
      res.status(200).json({
        status: 200,
        data,
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static updateGroupName(req, res) {
    const values = [
      req.body.name,
      req.params.id,
    ];

    db.updateGroupName(values).then(() => {
      res.status(200).json({
        status: 200,
        data: [{
          id: req.params.id,
          name: req.body.name,
          role: 'admin',
        }],
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static deleteGroup(req, res) {
    const groudId = req.params.id;

    db.deleteGroup(groudId).then((rows) => {
      const message = `Group ${rows[0].name} deleted `;
      res.status(200).json({
        status: 200,
        data: [{
          message,
        }],
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }
}
export default GroupController;
