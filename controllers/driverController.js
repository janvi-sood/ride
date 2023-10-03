const Driver= require('../model/driver');
const nodemailer = require('nodemailer');
const bcrypt = require ('bcryptjs') ;
const random = require('random-token');

const taskcontroller = {
    driverRegistration : async (request,h) =>{
        try{ 
            var driver = new Driver(request.payload);
            const salt = await bcrypt.genSalt(10);
            const token = random(10);
            const hashedPassword = await bcrypt.hash(driver.password, salt);
            driver.password = hashedPassword ; 
            driver.token = token;
            var result = await driver.save();
                return {message : "Driver created successfully", result};
            }catch(error) {
            return h.response("error");
        } 
    },
   driverLogin : async(request,h) => {
        try{  const {driverEmail, password } = request.payload;
            
              const driver = await Driver.findOne({driverEmail});
              isBlock = driver.isBlock ; 
                   if (driver){
                        const validpassword = await bcrypt.compare(password, driver.password);;
                        if (validpassword) {
                            if (isBlock)
                            {return h.response("Driver is blocked by admin")
                        }
                            return  h.response("Login Successfull");
                            
                        }else 
                        return h.response("invalid  password");
                    }else   
                        return h.response("invalid username or password");
        }catch(error) {
        return ("error");
    }
    
    },    
    editProfile : async(request,h) => {
        try{ const {credentials } = request.auth ;
            var user = await Driver.findByIdAndUpdate({_id : credentials._id}, request.payload, {new : true});
            return h.response({message : "Profile Updated successfully" , user});
            

        } catch(error) {
            return ("error");
        } 
      },

    changePassword : async (request,h) =>{
        try{  
            const {oldPassword,newPassword} = request.payload ;
            const {credentials } = request.auth ;
            const driver = await Driver.findById ({_id : credentials._id});
              if(!driver) {
                return('Invalid Credentials');
              }           
             const isValid =  await bcrypt.compare(oldPassword , driver.password) ;
                  if (!isValid){
                    
                   return h.response('Invalid old password');
                }
                 const salt = await bcrypt.genSalt(10);
                 driver.password = (newPassword);
            const hashedPassword = await bcrypt.hash(driver.password, salt);
            driver.password = hashedPassword ; 
            var result = await driver.save();
                return {message : 'Password changed successfully'};
            
            
            }catch(error) {
            return ("error");
        } 
    },
    resetPasswordRequest  :  async (request , h) =>{
        const { driverEmail } = request.payload;

        try {
          
          const resetToken = random(32);
          const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
  
          const driver= await Driver.findOneAndUpdate( { driverEmail }, {resetToken, resetTokenExpiry, },{ new: true } );
  
          if (!driver) {
            return h.response('User not found');
          }
  
          sendResetTokenEmail(driver.driverEmail, resetToken);
  
          return { message: 'Reset token sent successfully' };
        } catch (error) {
          console.error(error);
          return h.response('An error occurred while processing your request');
        }
      },
      
      resetPasswordConfirm : async (request, h) => {
        const { resetToken } = request.params ; 
        const {credentials} = request.auth ; 
        driverEmail = credentials.driverEmail;
        const { newPassword } = request.payload;
  
        try {
          
          const driver = await Driver.findOne({ driverEmail : driverEmail });
          
  
          if (!driver || driver.resetToken !== resetToken  || driver.resetTokenExpiry < new Date()) {
            return h.response('Invalid or expired reset token');
          }
  
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          driver.password = hashedPassword;
          driver.resetToken = null;
          driver.resetTokenExpiry = null;
          await driver.save();
  
          return { message: 'Password reset successfully' };
        } catch (error) {
          console.error(error);
          return h.response('An error occurred while processing your request');
        }
      },
};
    

function sendResetTokenEmail(driverEmail, resetToken) {
    const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: ' testapi381@gmail.com',
    pass:  'test@1234',
    },
    });
    
    const mailOptions = {
    from: 'testapi381@gmail.com',
    to: driverEmail,
    subject: 'Password Reset',
    text: `Your password reset token is: ${resetToken}`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    console.error(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
    });
    }
    module.exports = taskcontroller
