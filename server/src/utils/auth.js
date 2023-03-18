const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    const token = await res.headers.authorization.split(" ")[1];
    const verify = await jwt.verify(token, process.env.SECRET);
    req.user = verify;
    next();
  } catch (e) {
    return res.status(401).json({ content: "protected" });
  }
}

module.exports = auth;