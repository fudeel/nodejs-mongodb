const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");

const playerAvailabilityController = require("../src/matches/player-availability.controller");

router.post("/add-player-to-waiting-list", cleanBody, playerAvailabilityController.AddPlayerToWaitingList);



module.exports = router;
