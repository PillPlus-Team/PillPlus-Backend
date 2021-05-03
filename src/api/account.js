const express = require("express");
const router = express.Router();

const db = require("../models");

const {
    onlyAdmin,
    forHospital
} = require("../common/middleware");

const {
    handlePassword,
    checkDuplicateEmailOrPhone
} = require("../common/actions");

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

module.exports = router;
