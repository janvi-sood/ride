const AuthBearer = require('hapi-auth-bearer-token');
const Users = require('../model/user');
const Driver = require('../model/driver');


const validateUser= async (request, token, h) => {
    try {
        const user = await Users.findOne({token});
        if(user) {
        const credentials = { _id: user._id, userName: user.userName  ,userPhoneNo : user.userPhoneNo , userEmail : user.userEmail};
        
        return { isValid : true, credentials };
    } else {
        return {isValid : false, credentials : null}
    }
    } catch (error) {
        return { isValid: false, credentials: null };
      }
} ;
const validateDriver= async (request, token, h) => {
   try{ 
        const driver = await Driver.findOne({token});
        if(driver){
        const credentials = { _id: driver._id, driverName: driver.driverName, driverContact : driver.driverContact,  driverEmail : driver.driverEmail};
        console.log("auth")
        return { isValid : true, credentials };
    } else {
        return {isValid : false, credentials : null}
    }
}catch (error) {
    return { isValid: false, credentials: null };
  }
};

       

const Auth = [
{name: 'auth-bearer-token',
    register: async (server, options) => {
        await server.register(AuthBearer);
        server.auth.strategy('token', 'bearer-access-token',{ validate : validateUser });
        server.auth.strategy('driverToken', 'bearer-access-token',{ validate : validateDriver });

        
    } 
}
]



module.exports = Auth