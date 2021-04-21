const express = require("express");
const router = express.Router();

const auth = require("./auth");
const admin = require("./admin");
const picture = require("./picture");

const expressJwt = require("express-jwt");
const { notFound } = require("../common/middleware");
const { errorRes } = require("../common/response");

router.get("/ping", (req, res) => res.json("pong"));
router.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS512"],
    credentialsRequired: false,
    getToken: function fromHeader(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        } else if (req.cookies.cookieToken) {
          return req.cookies.cookieToken;
        }
        return null;
      },
    }),
    (err, req, res, next) => {
      if (err.name === "UnauthorizedError") {
        console.error(req.user, req.ip, "invalid token");
        return errorRes(res, err, "Login to proceed", 401);
      }
      next();
    }
    );
    
router.use("/admin", admin);
router.use("/auth", auth);
router.use("/picture", picture);
router.use(notFound);

module.exports = router;
