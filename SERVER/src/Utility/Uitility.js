import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class Utility {
  static getToken(payload) {
    dotenv.config();
    const token = jwt.sign({ payload }, process.env.JWT_PRIVATE_SECRET, { expiresIn: '1h' });
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
