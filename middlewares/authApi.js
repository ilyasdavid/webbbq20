const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const decode = jwt.verify(req.headers.token, "key_rahasia");
  if (decode) {
    req.user = decode.user;
    next();
  } else {
    res.status(403).json({ message: "Invalid Token" });
  }
};

const isAuthorized = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(401).json({
      message: "User Not Authorized, You are not Admin"
    });
  }
};

module.exports = {
  isAuth,
  isAuthorized
};
