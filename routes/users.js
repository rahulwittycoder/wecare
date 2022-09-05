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
  const user = [{
    Name : req.body.name,
    UserID : constructUserId,
    Password : req.body.password,
    DateOfBirth : req.body.dateOfBirth,
    Gender : req.body.gender,
    MobileNumber : req.body.mobileNumber,
    Email : req.body.email,
    PinCode : req.body.pincode,
    City : req.body.city,
    State : req.body.state,
    Country : req.body.country
  }];
  try{
    if(db.users.find({Email : req.body.email}))
    {
      res.status(400).send({message : "User exists with this email id."});
    }
    const ans = await db.users.create(user);
    res.json(ans);
  }catch(err)
  {
    res.status(201).send(err);
  }
});

router.post('/login',async(req,res)=>{
  const userId = req.body.userId;
  const userPass = req.body.password;
  try{
    const foundUser = await db.users.find({UserID : userId, Password : userPass});
    if(foundUser.length!=0)
    {
      res.send({message : "Login Success"});
    }
    else
    {
      let error = new Error("Invalid UserId or password!");
      throw error;
    }
  }catch(err){
    res.send(err.toString());
  };
});

router.get('/:userId',async(req,res)=>{
  try{
      const availableUsers = await db.users.find({UserID : req.params.userId});
      res.json(availableUsers);
  }
  catch(err)
  {
      res.send(err);
  }
});

router.post('/booking/:userId/:coachId',async(req,res)=>{
  var date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear().toString().slice(-2);
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  var constructBookingId = "B-"+year + month + date + hours + minutes + seconds ;

  const userBooking = [{
    BookingID : constructBookingId,
    UserID : req.params.userId,
    CoachID : req.params.coachId,
    AppointmentDate : req.body.DateOfAppointment,
    Slot : req.body.Slot
  }];

  try{
    const foundUser = await db.users.find({UserID : req.params.userId});
    const foundCoach = await db.coaches.find({CoachID : req.params.coachId});

    const date1 = new Date(req.body.DateOfAppointment);
    var today = new Date();
    today.setHours(0,0,0,0);
    var nextWeek = new Date(today.getFullYear(),today.getMonth(),today.getDate()+7);
    nextWeek.setHours(0,0,0,0);
    if(foundUser && foundCoach)
    {
      console.log(userBooking);
      const clash = await db.bookings.find({AppointmentDate : req.body.DateOfAppointment, Slot : req.body.Slot})
      //console.log(clash);
      if(date1 < today || date1 > nextWeek)
      {
        res.status(400).json({message : "Date should be any upcoming 7 days."});
      }
      else
      {
        if(clash.length>0)
        {
         res.status(400).json({message : "There is an appointment in this slot already."});
        }
        else
        {
          const booked = await db.bookings.create(userBooking);
          res.status(200).send("true");
        }
      }
    }
    else if(foundUser.length==0)
    {
      res.status(400).json({message:"User id does not exist"});
    }
    else
    {
      res.status(400).json({message:"Coach id does not exist"});
    }
  }catch(err){
    res.send(err.toString());
  };
});

router.get("/booking/:userID", async(req,res)=>{
  const uid = req.params.userID;
  try{
    const findapnts =await db.bookings.find({UserID : uid});
    if(findapnts.length>0)
    {
      res.status(200).json(findapnts);
    }
    else
    {
      res.status(400).json({message : "Could not find any appointment details."});
    }
  }
  catch(err)
  {
    res.send(err.toString());
  }
});
module.exports = router;
