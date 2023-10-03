const Basic = require('@hapi/basic');
const User = require ( '../model/user');



const validate = async (request, email, password) => {

    const user = await User.findOne({email});
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = (password === user.password);
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
};
 
 
const Auth = [
    {name: 'basic-auth',
    register: async (server, options) => {
        await server.register(Basic);

        server.auth.strategy('simple', 'basic', { validate });
        // server.auth.default('simple');
    } 
},


];

module.exports = Auth