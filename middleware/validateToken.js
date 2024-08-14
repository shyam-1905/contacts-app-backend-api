const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = AsyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader) {
    res.status(401);
    throw new Error("Token not provided");
  }
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Token not provided or not authorized");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      console.log("decoded", decoded);
      req.user = decoded.user;
      next();
    });
  }
});

module.exports = validateToken;
