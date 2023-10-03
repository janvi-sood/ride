const RideController = require('../controllers/rideController');
const Joi = require('joi');

const Routes =  [
   
  {
    method: 'POST',
    path: '/bookRide',
    options: {
      description:" book ride",
              tags:['api'],
            validate: {
                payload: Joi.object({
                    pickUp  : Joi.string().required(),
                    destination  : Joi.string().required(),
                    bookingDate : Joi.date()
                })
            },
            auth :'token'
        },
        handler: RideController.bookRide
        },
  {
    method: 'GET',
    path: '/myRides',
    options: {
      description:" show all rides booked by user",
              tags:['api'],
          validate:{
           query:  Joi.object({
                driverName: Joi.string(),
                driverContact: Joi.number() ,
                pickUp : Joi.string(),
                destination : Joi.string(),
                bookingDate  :Joi.date(),
                rideStatus : Joi.string(),
                fare : Joi.number(),
                distance : Joi.number()
            })
        },
            auth :'token' 
     },
    handler: RideController.myRides,
  },
  {
    method: 'DELETE',
    path: '/cancelRides/{rideId}',
    options: { 
      description:" cancel ride by user ",
              tags:['api'],
      validate: {
        params : Joi.object({
          rideId  : Joi.string().required()

        })
      },
        auth : 'token'
    },
    
    handler: RideController.cancelRide,
  },
  {
    method: 'POST',
    path: '/acceptRides/{rideId}',
    options: { 
      description:" ride acceptance by drivers  ",
              tags:['api'],
      validate: {
        params : Joi.object({
          rideId  : Joi.string().required()

        })
      },
        auth : 'driverToken'
    },
    
    handler: RideController.acceptRide,
  },
  {
    method: 'PUT',
    path: '/updateRides/{rideId}',
    options: { 
      description:" update ride status  by driver ",
              tags:['api'],
        validate : {
          payload : Joi.object({
            newStatus : Joi.string().required()
          })
        },
        auth : 'driverToken'
    },
    
    handler: RideController.updateRideStatus,
  },
  {
    method: 'GET',
    path: '/driverRides',
    options: { 
      description:" show all rides accepted ,completed, cancelled by driver",
              tags:['api'],
      validate : {
        query : Joi.object({
          userName: Joi.string(),
          userPhoneNo: Joi.number() ,
          pickUp : Joi.string(),
          destination : Joi.string(),
          bookingDate  :Joi.date(),
          rideStatus : Joi.string(),
          fare : Joi.number(),
          distance : Joi.number()


        })
      },
        auth : 'driverToken'
    },
    
    handler: RideController.driverRides
  }
  
];
 
module.exports  = Routes