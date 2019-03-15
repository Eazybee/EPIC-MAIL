import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
class Utility {
  static getToken(payload) {
    const token = jwt.sign({ payload }, process.env.JWT_PRIVATE_SECRET);
    return token;
  }

  static handleError(res, errorMessage, status = 400) {
    res.status(status).send({
      status,
      error: errorMessage,
    });
  }
}
export default Utility;
