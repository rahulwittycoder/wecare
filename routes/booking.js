var express = require('express');
var router = express.Router();
const db = require("../src/models/connection");
router.put("/:bookingID", async (req,res)=>{
    const find = await db.bookings.find({BookingID : req.params.bookingID});

    const date1 = new Date(req.body.DateOfAppointment);
    var today = new Date();
    today.setHours(0,0,0,0);
    var nextWeek = new Date(today.getFullYear(),today.getMonth(),today.getDate()+7);
    nextWeek.setHours(0,0,0,0);

    if(find.length==0)
    {
        res.status(400).json({message : "Booking ID does not exist."});
    }

    const clash = await db.bookings.find({AppointmentDate : req.body.DateOfAppointment, Slot : req.body.Slot})

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
            try
            {
                const updated = await db.bookings.updateOne({BookingID : req.params.bookingID},{$set :{Slot : req.body.Slot , AppointmentDate : req.body.DateOfAppointment}});
                res.status(200).send("true");
            }
            catch(err)
            {
                res.send(err.toString);
            }
        }      
    }
});

router.delete("/:bookingID", async (req,res)=>{
    const find = await db.bookings.find({BookingID : req.params.bookingID});
    if(find.length>0)
    {
        const deleted = await db.bookings.deleteOne({BookingID : req.params.bookingID});
        res.status(200).send("true");
    }
    else
    {
        res.status(400).json({message : "Could not delete this appointment."});
    }
});
module.exports = router;