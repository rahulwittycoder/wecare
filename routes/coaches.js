var express = require('express');
var router = express.Router();
const db = require("../src/models/connection");
router.post('/', async(req,res)=>{
  var date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear().toString().slice(-2);
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  var constructUserId = year + month + date + hours + minutes + seconds + "";
  const coach = [{
    Name : req.body.name,
    CoachID : constructUserId,
    Password : req.body.password,
    DateOfBirth : new Date(req.body.dateOfBirth),
    Gender : req.body.gender,
    MobileNumber : req.body.mobileNumber,
    Speciality : req.body.speciality
  }];
  try{
    const ans = await db.coaches.create(coach);
    res.json(ans);
  }catch(err)
  {
    res.send(err);
  }
});

router.post('/login',async(req,res)=>{
  const coachId = req.body.coachId;
  const coachPass = req.body.password;
  try{
    const foundCoach = await db.coaches.find({CoachID : coachId, Password : coachPass});
    if(foundCoach.length!=0)
    {
      res.send({message : "Login Success"});
    }
    else
    {
      let error = new Error("Invalid CoachId or password!");
      throw error;
    }
  }catch(err){
    res.send(err.toString());
  };
});

router.get('/all',async(req,res)=>{
    try{
        const availableCoaches = await db.coaches.find({});
        res.json(availableCoaches);
    }
    catch(err)
    {
        res.send(err);
    }
});

router.get('/:coachId',async(req,res)=>{
    try{
        const availableCoaches = await db.coaches.find({CoachID : req.params.coachId});
        res.json(availableCoaches);
    }
    catch(err)
    {
        res.send(err);
    }
});

router.get("/booking/:coachID", async(req,res)=>{
    try{
        const findappointments = await db.bookings.find({CoachID : req.params.coachID});
        if(findappointments.length>0)
        {
            res.status(200).json(findappointments);
        }
        else
        {
            res.status(400).json({message : "Could not find any bookings."});
        }
    }
    catch(err)
    {
        res.send(err.toString());
    }
});
module.exports = router;
