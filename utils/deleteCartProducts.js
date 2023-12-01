require("dotenv").config();
const axios = require("axios");
const deteCartProducts = async (id) => {
  console.log("userid", id);
  axios.delete(`${process.env.YOUR_API_URL}/cart/${id}`);
};

module.exports = { deteCartProducts };
