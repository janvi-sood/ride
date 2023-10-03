const userController = require('../controllers/userController');
const Joi = require('joi');


const Routes = [
    {
        method :"POST",
        path :"/userRegister",
        config : { 
            description:" user registration ",
            tags:['api'],
            validate: {
                payload: Joi.object({
                    userName: Joi.string().min(3).max(30).required(),
                    userEmail: Joi.string().email().required() ,
                    password : Joi.string().required(),
                    userPhoneNo : Joi.number().required()
                }),
           }
        },
        handler:  userController.userRegistration
    },
    {
        method: 'POST',
        path: '/userLogin',
        options: {
            description:" user login ",
              tags:['api'],
            validate: {
                payload: Joi.object({
                    userEmail: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            },
            auth :'token'
        },
        handler: userController.userLogin
        },
        {
            method :"PUT",
            path :"/userEditProfile",
            options: {
                description:" user edit profile  ",
              tags:['api'],

                validate: {
                        payload: Joi.object({
                        
                        userName: Joi.string().min(3).max(30),
                         userEmail: Joi.string().email(),
                         password : Joi.string(),
                         userPhoneNo : Joi.number(),
                         token : Joi.string()
                }) 
            },
            auth : 'token' 
        },
            handler: userController.editProfile
},

{
    method: 'POST',
    path: '/userChangePassword',
    options: {
        description:" user change password ",
              tags:['api'],
        validate: {
            payload: Joi.object({
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().required()
            })
        },
        auth :'token'
    },
    handler: userController.changePassword
    },
    {
        method: 'POST',
        path: '/userResetPassword/request',
        options: {
            description:" user reset  password request ",
              tags:['api'],
            validate: {
              payload: Joi.object({
                userEmail: Joi.string().email().required(),
              }),
            },
            auth : 'token'
        },
        handler: userController.resetPasswordRequest
        },
    
      {
        method: 'POST',
        
        path: '/userResetPassword/confirm/{resetToken}',
        handler: userController.resetPasswordConfirm  ,
        options: {
            description:" user reset  password ",
              tags:['api'],
          validate: {
            params :  Joi.object({
              
                
                resetToken : Joi.string().required()
              }),
           
            payload: Joi.object({
              
              newPassword: Joi.string().required(),
           
            }),
          },
          auth : 'token'
        },
      },

]
module.exports = Routes