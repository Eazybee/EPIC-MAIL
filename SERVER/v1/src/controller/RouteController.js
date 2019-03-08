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
    return false;
  }

  static login(req, res) {
    return false;
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
export default RouteController;
