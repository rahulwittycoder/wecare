const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validate = require("./validation");
//mongoose.set('useCreateIndex',true);
mongoose.connect("mongodb://localhost:27017/weCareDB",{useNewUrlParser : true , useUnifiedTopology : true}).then()
.catch((error)=>{
    let err = new Error("Couldn't Connect To Database");
    err.status = 500;
    throw err;
});

const con = mongoose.connection;
con.on('open', function(){
    console.log("Connection Success!");
});

const userSchema = new mongoose.Schema({
    "Name" : {
        required : [true,'Required Field'],
        type : String,
        unique : false,
        validate: {
            validator: function(val) {
                return val.length >= 3 && val.length <=50
            },
            message: () => "Name should be atleast 3 characters and maximum of 50 characters."
        },
    },
    "UserID" : {
        required : [true,'Required Field'],
        type : Number,
        unique : true
    },
    "Password" : {
        required : [true, 'Required Field'],
        type : String,
        unique : false,
        validate: {
            validator: function(val) {
                return val.length >= 5 && val.length <=10
            },
            message: () => "Password can have minimum 5 and maximum of 10 characters."
        },
    },
    "Gender" : {
        required : [true, 'Required Field'],
        type : String,
        unique : false,
        validate: {
            validator: function(val) {
                return val.length == 1 && (val==="M" || val=="F")
            },
            message: () => "Gender should be either M or F."
        },
    },
    "DateOfBirth" : {
        required : [true, 'Required Field'],
        type : Date,
        unique : false,
        validate: {
            validator: function(val) {
                let year = val.getFullYear();
                let currYear = new Date();
                return currYear.getFullYear() - year > 20 && currYear.getFullYear() - year < 100
            },
            message: () => "Age should be less than 100 and greater than 20."
        },
    },
    "Email" : {
        required : [true, 'Required Field'],
        type : String,
        unique : true,
        //validate: [validate.validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    "MobileNumber" : {
        required : [true, 'Required Field'],
        type : String,
        unique : true,
        validate: {
            validator: function(val) {
                return val.length==10
            },
            message: () => "Phone number should have 10 digits only."
        },
    },
    "PinCode" : {
        required : [true, 'Required Field'],
        type : Number,
        unique : false,
        validate: {
            validator: function(val) {
                return val.toString().length==6
            },
            message: () => "PIN code should have 6 digits only."
        },
    },
    "City" : {
        required : [true, 'Required Field'],
        type : String,
        unique : false,
        validate: {
            validator: function(val) {
                return val.length>=3 && val.length<=20
            },
            message: () => "Max length 20 and min length 3."
        },
    },
    "State" : {
        required : [true, 'Required Field'],
        type : String,
        unique : false,
        validate: {
            validator: function(val) {
                return val.length>=3 && val.length<=20
            },
            message: () => "Max length 20 and min length 3."
        },
    },
    "Country" : {
        required : [true, 'Required Field'],
        type : String,
        unique : false,
        validate: {
            validator: function(val) {
                return val.length>=3 && val.length<=20
            },
            message: () => "Max length 20 and min length 3."
        },
    }
});

const coachesSchema = new mongoose.Schema({
    "CoachID" : {
        type : Number,
        required : [true, 'Required Field'],
        unique : true
    },
    "Name" : {
        type : String,
        required : [true, 'Required Field'],
        unique : false,
        validate: {
            validator: function(val) {
                return val.length >= 3 && val.length <=50
            },
            message: () => "Name should be atleast 3 characters and maximum of 50 characters."
        },
    },
    "DateOfBirth" : {
        type : Date,
        required : [true, 'Required Field'],
        unique : false
    },
    "Password" : {
        type : String,
        required : [true, 'Required Field']
    },
    "Gender" : {
        type : String,
        required : [true, 'Required Field'],
        unique : false
    },
    "MobileNumber" : {
        type : Number,
        required : [true, 'Required Field'],
        unique : true,
        validate: {
            validator: function(val) {
                return val.length==10
            },
            message: () => "Phone number should have 10 digits only."
        },
    },
    "Speciality" : {
        type : String,
        required : [true, 'Required Field'],
        unique : false
    }
});

const bookingsSchema = new mongoose.Schema({
    "BookingID" : {
        type : String,
        required : [true, 'Required Field'],
        unique : true
    },
    "UserID" : {
        type : String,
        required : [true, 'Required Field'],
        unique : false
    },
    "CoachID" : {
        type : String,
        required : [true, 'Required Field'],
        unique : false
    },
    "AppointmentDate" : {
        type : Date,
        required : [true, 'Required Field'],
        unique : false
    },
    "Slot" : {
        type : String,
        required : [true, 'Required Field'],
        unique : false
    }
});
const users = mongoose.model('users',userSchema);
const coaches = mongoose.model('coaches',coachesSchema);
const bookings = mongoose.model('bookings',bookingsSchema);
module.exports = { users, coaches, bookings };