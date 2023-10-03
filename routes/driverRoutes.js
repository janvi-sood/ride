const driverController = require('../controllers/driverController');

const Joi = require('joi');


const Routes = [
    {
        method :"POST",
        path :"/driverRegister",
        config : { 
          description:" driver registration ",
              tags:['api'],
             
            validate: {
                payload: Joi.object({
                    driverName: Joi.string().min(3).max(30).required(),
                    driverEmail: Joi.string().email().required() ,
                    password : Joi.string().required(),
                    driverContact : Joi.number(),
                    driverVehicletype : Joi.string(),
                    token : Joi.string()
                }),
            }
          },
        handler:  driverController.driverRegistration
    },
    {
        method: 'POST',
        path: '/driverLogin',
        options: {
          description:" driver login ",
              tags:['api'],
            validate: {
                payload: Joi.object({
                    driverEmail: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            },
            auth :'driverToken'
        },
        handler: driverController.driverLogin
        },

        {
            method :"PUT",
            path :"/driverEditProfile",
            options: {
              description:" driver edit profile ",
              tags:['api'],

                validate: {
                        payload: Joi.object({
                        
                        
                         driverName: Joi.string().min(3).max(30),
                         driverEmail: Joi.string().email(),
                         driverContact : Joi.number(),
                         driverVehicletype : Joi.string(),
                         token : Joi.string()
                }) 
            },
            auth : 'driverToken' 
        },
            handler: driverController.editProfile
        },
        {
            method: 'POST',
            path: '/driverChangePassword',
            options: {
              description:" driver change password ",
              tags:['api'],
                validate: {
                    payload: Joi.object({
                        oldPassword: Joi.string().required(),
                        newPassword: Joi.string().required()
                    })
                },
                auth :'driverToken'
            },
            handler: driverController.changePassword
            },

  {
    method: 'POST',
    path: '/driverResetPassword/request',
    options: {
      description:" driver reset password request ",
      tags:['api'],
        validate: {
          payload: Joi.object({
            driverEmail: Joi.string().email().required(),
          }),
        },
      auth : 'driverToken'
     
    },
    handler: driverController.resetPasswordRequest
    },

  {
    method: 'POST',
    path: '/driverResetPassword/confirm/{resetToken}',
   options: {
    description:" driver reset password ",
    tags:['api'],
      validate: {
        params: Joi.object({
          
          resetToken: Joi.string().required(),
        }),
      
        payload: Joi.object({
          
          newPassword: Joi.string().required(),
        }),
      },
      auth : 'driverToken'
    },
    handler: driverController.resetPasswordConfirm  
    
  },
];

module.exports = Routes