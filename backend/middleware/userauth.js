const jwt = require('jsonwebtoken');
module.exports = function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({
        msg: 'Authorization denied!',
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWTSECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      console.error(err.message);
      res.status(401).json({
        msg: 'Authorization denied!',
      });
    }
  }
  