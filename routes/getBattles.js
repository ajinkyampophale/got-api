const express = require('express');
const router = express.Router();
const Battles = require('../models/battles');
const {validateSearch} = require('../validation/search');

// welcome page
router.get('/', (req, res) => {
  res.render("index");
});

// for fetching list / array of places where battle took place
router.get('/list', async (req, res) => {
  
  try{
    
    const result = await Battles.find({}, {_id: 0, location: 1, region: 1});

    const finalResult = result.map(element => `${element.region} - ${element.location}`);

    res.status(200).json({status: 200, message: "Successfull", data: {
      placesList: finalResult
    }});

  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 200, message: "Something went wrong!! Please try after some t"});
  }

});

// for fetching the count of total numbers of battles
router.get('/count', async (req, res) => {
  
  try{
    
    const result = await Battles.find().countDocuments();

    res.status(200).json({status: 200, message: "Successfull", data: {
      count: result
    }});

  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 200, message: "Something went wrong!! Please try after some t"});
  }

});

// for fetching the stats of the battle battles
router.get('/stats', async (req, res) => {
  
  try{
    
    // for fetching most active attacker_king, defender_king, region, name based on higest battle numbers
    const mostActivePromise = Battles
      .find({}, {_id: 0, attacker_king: 1, defender_king: 1, region: 1, name: 1})
      .sort({battle_number: -1})
      .limit(1);

    // for fetching total wins and losses on attacker_outcome
    const attackerOutcomePromise = Battles.aggregate([
      {$facet: {
        "win": [
          {$match: {attacker_outcome: "win"}},
          {$count: "win"}
        ],
        "loss": [
          {$match: {attacker_outcome: "loss"}},
          {$count: "loss"}
        ]
      }},
      {$project: {
        "win": {"$arrayElemAt": ["$win.win", 0]},
        "loss": {"$arrayElemAt": ["$loss.loss", 0]}
      }}
    ]);

    // for fetching unique battle types
    const uniqueBattleTypesPromise = Battles.distinct("battle_type", {"battle_type": {$nin: ["", null]}});

    // for fetching average, min and max based on defender_size
    const defenderSizePromise = Battles.aggregate([
      {$match: {defender_size: {$exists: true, $ne: null, $ne: ""}}},
      {$facet: {
        "average": [
          {$group: {_id: null,  average: {$avg: "$defender_size"}}}
        ],
        "min": [
          {$group: {_id: null,  min: {$min: "$defender_size"}}}
        ],
        "max": [
          {$group: {_id: null,  max: {$max: "$defender_size"}}}
        ]
      }},
      {$project: {
        "average": {$round: [{"$arrayElemAt": ["$average.average", 0]}, 2]},
        "min": {"$arrayElemAt": ["$min.min", 0]},
        "max": {"$arrayElemAt": ["$max.max", 0]}
      }}
    ]);

    // promise all
    const [mostActiveResult, attackerOutcomeResult, uniqueBattleTypesResult, defenderSizeResult] = 
      await Promise.all([mostActivePromise, attackerOutcomePromise, uniqueBattleTypesPromise, defenderSizePromise]);

    const finalObject = {
      most_active: {},
      attacker_outcome: {},
      battle_type: [],
      defender_size: {}
    };
    
    // on success
    if(mostActiveResult && mostActiveResult.length > 0){
      const {attacker_king, defender_king, region, name} = mostActiveResult[0];
      finalObject.most_active = {attacker_king, defender_king, region, name};
    }

    if(attackerOutcomeResult && attackerOutcomeResult.length > 0){
      const {win, loss} = attackerOutcomeResult[0];
      finalObject.attacker_outcome = {win, loss};
    }

    if(uniqueBattleTypesResult && uniqueBattleTypesResult.length > 0){
      finalObject.battle_type = uniqueBattleTypesResult;
    }

    if(defenderSizeResult && defenderSizeResult.length > 0){
      const {average, min, max} = defenderSizeResult[0];
      finalObject.defender_size = {average, min, max};
    }

    res.status(200).json({status: 200, message: "Successfull", data: finalObject});

  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 200, message: "Something went wrong!! Please try after some t"});
  }

});

// for searching battle field data
router.get('/search', validateSearch, async (req, res) => {
  
  try{

    if(res.locals.error) {
      return res.status(400).json({status: 400, message: res.locals.message});
    }

    let {king, location, type} = req.query;
    const searchArray = [];

    if(king){
      king = king.trim();
      searchArray.push({"$or": [ {attacker_king: king}, {defender_king: king} ]});
    }

    if(location){
      location = location.trim();
      searchArray.push({location});
    }

    if(type){
      type = type.trim();
      searchArray.push({battle_type: type});
    }

    const result = await Battles.find({"$and": searchArray});

    res.status(200).json({status: 200, message: "Successfull", data: {
      battles: result
    }});

  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 200, message: "Something went wrong!! Please try after some t"});
  }

});

module.exports = router;