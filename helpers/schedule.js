const schedule = require('node-schedule');
const cartModel = require('../models/cart')

function deleteOldCarts(){ 
  console.log("start");
  // "*/15 * * * * *" executes every 15 seconds
    // executes every day at mid-night
  schedule.scheduleJob("0 0 * * *", async () => {
    const expirationTime = new Date() - 2592000;  // 1 month past
    // Find and delete documents where expirationTime is less than the time of the last Update
    await cartModel.deleteMany({ updatedAt: { $lte: expirationTime }}).catch(err => console.log(err));
    console.log("deleted");
  });
}

module.exports = deleteOldCarts
