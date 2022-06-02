const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");

const playerAvailabilityController = require("../src/matches/player-availability.controller");

router.post("/add-player-availability-to-selected-date-array", cleanBody, playerAvailabilityController.AddPlayerAvailabilityToSelectedDateArray);



module.exports = router;
