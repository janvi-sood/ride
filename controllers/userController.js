const User= require('../model/user');
const nodemailer = require('nodemailer');
const bcrypt = require ('bcryptjs') ;
const random = require('random-token');



const taskcontroller = {
    userRegistration : async (request,h) =>{
        try{ 
           
            var user = new User(request.payload);
            const salt = await bcrypt.genSalt(10);
            const token = random(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword ; 
            user.token = token;
            var result = await user.save();
                return {message : "User created successfully", result};
            }catch(error) {
            return "error";
        } 
    },
    userLogin : async(request,h) => {
        try{  const {userEmail, password } = request.payload;
              const user = await User.findOne({userEmail});
              isBlock = user.isBlock ; 
                   if (user){
                        const validpassword = await bcrypt.compare(password, user.password);;
                        if (validpassword) {
                            if (isBlock)
                            {return h.response("User is blocked by admin")
                        }
                            return  h.response("Login Successfull");
                            
                        }
                     }else   
                        return h.response("invalid username or password");
        }catch(error) {
        return ("error");
    }
    
    },    
    editProfile : async(request,h) => {
        try{ const {credentials } = request.auth ;
            var user = await User.findByIdAndUpdate({_id : credentials._id}, request.payload, {new : true});
            return h.response({message : "Profile Updated successfully" , user});
            

        } catch(error) {
            return ("error");
        } 
      },
      changePassword : async (request,h) =>{
        try{  
            const {oldPassword,newPassword} = request.payload ;
            const {credentials } = request.auth ;
            const user = await User.findById ({_id : credentials._id});
              if(!user) {
                return('Invalid Credentials');
              }           
             const isValid =  await bcrypt.compare(oldPassword , user.password) ;
                  if (!isValid){
                    
                   return h.response('Invalid old password');
                }
                 const salt = await bcrypt.genSalt(10);
                 user.password = (newPassword);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword ; 
            var result = await user.save();
                return {message : 'Password changed successfully'};
            
            }catch(error) {
            return ("error");
        } 
    },
    resetPasswordRequest  :  async (request , h) =>{
        const { userEmail } = request.payload;

        try {
          
          const resetToken = random(32);
          const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
  
          const user = await User.findOneAndUpdate( { userEmail }, {resetToken, resetTokenExpiry, },{ new: true } );
  
          if (!user) {
          
            return h.response('User not found');
          }
  
          sendResetTokenEmail(user.userEmail, resetToken);
  
          return { message: 'Reset token sent successfully' };
        } catch (error) {
          console.error(error);
          return h.response('An error occurred while processing your request');
        }
      },
      
      resetPasswordConfirm : async (request, h) => {
        const { resetToken } = request.params ; 
        const {credentials} = request.auth ; 
        userEmail = credentials.userEmail;
                const {newPassword } = request.payload;
  
        try {
          
          const user = await User.findOne({userEmail : userEmail });
  
          if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < new Date()) {
            return h.response('Invalid or expired reset token');
          }
  
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiry = null;
          await user.save();
  
          return { message: 'Password reset successfully' };
        } catch (error) {
          
          return h.response('An error occurred while processing your request');
        }
      },
};
 
function sendResetTokenEmail(userEmail, resetToken) {

const transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
user: 'testapi381@gmail.com',
pass: 'test@1234',
},
});

const mailOptions = {
from: 'testapi381@gmail.com',
to: userEmail,
subject: 'Password Reset',
text: `Your password reset token is: ${resetToken}`, //reset link to be added
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
