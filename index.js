const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const userRoutes= require('./routes/userRoutes');
const driverRoutes= require('./routes/driverRoutes');
const rideRoutes= require('./routes/rideRoutes');
const basicAuthPlugin = require('./plugins/authBasic');
const AuthBearerPlugin = require('./plugins/authBearer');


const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

mongoose.connect('mongodb://127.0.0.1:27017/Ride_App')

 .then(() => { 
  console.log("db started!");
 })
 .catch((e) => {
  console.log(e);
 });

 const init = async () => {


    const server = Hapi.server({
        port: 4000,
        host: 'localhost'
    });

    const swaggerOptions = {
        info:{
            title:'Test API Documentation',
            
        },
        schemes: ['http','https']
    }

await server.register(basicAuthPlugin);
    await server.register(AuthBearerPlugin);
    
    server.validator(require('joi'));
    server.route(userRoutes);
    server.route(driverRoutes);
    server.route(rideRoutes);

    await server.register([
        Inert,
        Vision,
        {
            plugin:HapiSwagger,
            options:swaggerOptions
        }
    ])

   /* await server.register(baseRouter,{
		routes:{
			prefix:'/api'
		}
	}); */

    server.events.on('response', function (request) {
        console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
 
init();