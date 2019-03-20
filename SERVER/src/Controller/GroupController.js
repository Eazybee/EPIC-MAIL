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
}
export default GroupController;
