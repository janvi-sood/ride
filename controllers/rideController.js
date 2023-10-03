const Ride = require("../model/ride");
const random = require("random-token");
const mongoose = require("mongoose");
const ObjectId  = mongoose.Types.ObjectId;


const rideController = {
  bookRide: async (request, h) => {
    try {
      const { credentials } = request.auth;
      const userId = credentials._id;
      var ride = new Ride(request.payload);
      ride.userId = userId;
      ride.userName = credentials.userName;
      ride.userPhoneNo = credentials.userPhoneNo;
      var result = await ride.save();

      return h.response({
        message: "Ride booked successfully....wait for driver acceptance",
        result,
      });
    } catch (error) {
      return h.response({ error: "Error creating ride" }).code(500);
    }
  },

  myRides: async (request, h) => {
    try {
      const userId = request.auth.credentials._id;
      const rides = await Ride.aggregate([
        {
          $match: {
            userId: new ObjectId(userId)
          }
        },
        {
          $project : {
            _id : 1,
            driverId :1,
            driverName :1 ,
            driverContact : 1,
            pickUp : 1 ,
            destination :1 ,
            fare :1,
            distance :1 ,
            bookingDate :1,
            rideStatus : 1
          }
        }
      ]);
      
      return h.response(rides).code(200);
      
    } catch (error) {
      return h.response({ error: "Error" }).code(500);
    }
  },

  cancelRide: async (request, h) => {
    try {
      const { rideId } = request.params;
      const userId = request.auth.credentials._id;

      const ride = await Ride.findOne({ _id: rideId, userId });

      if (!ride) {
        return h.response({ error: "Ride does not exist" });
      }
      if (ride.rideStatus === "cancelled") {
        return h.response({ error: "Ride already cancelled" });
      }

      ride.rideStatus = "cancelled";
      await ride.save();

      return h.response({ message: "Ride cancelled successfully" });
    } catch (error) {
      return h.response({ error: "Error cancelling ride" });
    }
  },

  acceptRide: async (request, h) => {
    try {
      const { rideId } = request.params;
      const driverId = request.auth.credentials._id;
      const driverName = request.auth.credentials.driverName;
      const driverContact = request.auth.credentials.driverContact;

      const ride = await Ride.findById({ _id: rideId });

      if (!ride) {
        return h.response({ error: "Ride not found" }).code(404);
      }

      if (ride.rideStatus !== "pending") {
        return h
          .response({ error: "Ride is not available for acceptance" }).code(400);

      }
      ride.rideStatus = "accepted";
      ride.driverId = driverId;
      ride.driverName = driverName;
      ride.driverContact = driverContact;
      await ride.save();

      return h.response({ message: "Ride accepted successfully" });
    } catch (error) {
      return h.response({ error: "Error accepting ride" });
    }
  },

  updateRideStatus: async (request, h) => {
    try {
      const { rideId } = request.params;
      const driverId = request.auth.credentials._id;
      const { newStatus } = request.payload;

      const ride = await Ride.findById({ _id: rideId });

      if (!ride) {
        return h.response({ error: "Ride not found" });
      }

      if (!["completed", "cancelled"].includes(newStatus)) {
        return h.response({ error: "Invalid update" });
      }

      ride.rideStatus = newStatus;
      await ride.save();

      return h
        .response({ message: `Ride status updated to ${newStatus}` })
        .code(200);
    } catch (error) {
      return h.response({ error: "Error updating ride status" }).code(500);
    }
  },
  driverRides: async (request, h) => {
    try {
      const driverId = request.auth.credentials._id;
      const rides = await Ride.aggregate([
        {
          $match: {
            driverId: new ObjectId(
              driverId
            )
          }
        },
        {
          $project : {
            _id : 1,
            userId :1,
            userName :1 ,
            userPhoneNo : 1,
            pickUp : 1 ,
            destination :1 ,
            fare :1,
            distance :1 ,
            bookingDate :1,
            rideStatus : 1
          }
        }
      ]);
      
      return h.response(rides).code(200);
    } catch (error) {
      console.log("error",error);
      return h.response({ error: "Error" }).code(500);
    }
  },
};
module.exports = rideController;
