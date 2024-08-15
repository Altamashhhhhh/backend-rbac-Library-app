const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "token is wrong or empty headers" });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "token is wrong or expired" });
      }
      req.user = decode;
      console.log(decode)
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Not authorized" });
  }
};


module.exports = auth ; 