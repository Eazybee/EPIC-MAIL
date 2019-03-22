// import db from '../Utility/Db';
// import Utility from '../Utility/Uitility';

// class Resolver {
//   static email(req, res, next) {
//     const { email } = req.body;
//     if (!email) {
//       const errorMessage = '"email" is required';
//       Utility.handleError(res, errorMessage, 400);
//     } else if (typeof email !== 'string') {
//       const errorMessage = '"email" must be of type string';
//       Utility.handleError(res, errorMessage, 400);
//     } else if (email.trim() === '') {
//       const errorMessage = '"email" should not be empty';
//       Utility.handleError(res, errorMessage, 400);
//     } else {
//       db.getUserId(email).then((rows) => {
//         const user = rows[0];
//         if (user) {
//           req.resolverId = parseInt(user.id, 10);
//           next();
//         } else {
//           const errorMessage = `User with email ${email} does not exist!`;
//           Utility.handleError(res, errorMessage, 400);
//         }
//       }).catch((err) => {
//         const errorMessage = `SERVER ERROR: ${err.message}`;
//         Utility.handleError(res, errorMessage, 500);
//       });
//     }
//   }
// }
// export default Resolver;
