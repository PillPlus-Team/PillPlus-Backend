const express = require("express");
const router = express.Router();

const db = require("../models");

const { 
    onlyAdmin, 
    handlePassword, 
    checkDuplicateEmailOrPhone 
} = require("../common/middleware");

const {
    addAccount,
    getAllAccounts,
    updateAccount,
    deleteAccount,
} = require("../controllers/Account.controller");

const User = require("../models").user;


// ---------------------------- API ---------------------------- //

router.get("/all", getAllAccounts); // fetch All data

router.use(onlyAdmin);
router.post("/", 
            checkDuplicateEmailOrPhone(db.user), 
            handlePassword,
            addAccount
          );
router.put("/:_id", updateAccount);
router.delete("/:_id", deleteAccount);

// Use when fetch some data
function userAtPage(req, res, next) {
  req.body = [{}, null, { limit: 25, skip: (req.params.page - 1) * 25 }];
  return next();
}

// function haveAvatar(req, res, next) {
//   const { avatar } = req.body;
//   if (!avatar) {
//     req.body.avatar = "avatar.jpg";
//   }
//   next();
// }

module.exports = router;
