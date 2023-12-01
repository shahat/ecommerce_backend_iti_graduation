const express = require("express");
const ordersModel = require("../models/orders");

const getComingOrderOfOneUser = async (req, res) => {
  var userId = req.params.id
  try {
    const allOrders = await ordersModel.find({userId : userId , status : "Waiting for Supplier"});
    res.status(200).json({ allOrders });
  } catch (err) {
    res.status(400).json({error:`error : ${err}`, why:"Be"});
  }
};

const getPastOrderOfOneUser = async (req ,res) =>{
  var userId = req.params.id
  try {
    const allOrders = await ordersModel.find({userId : userId , status : "shipped"});
    res.status(200).json({ allOrders });
  } catch (err) {
    res.status(400).json({error:`error : ${err}`, why:"Be"});
  }
}

const getAllOrdersForAdmin = async (req , res) =>{
  try {
    const allOrders = await ordersModel.find().limit(2).populate("userId");
    res.status(200).json({ allOrders });
  } catch (err) { 
    res.status(400).json({error:`error : ${err}`});
}
}


const getOneOrderById = async (req, res) => {
  var id = req.params.id;
  try {
    const order = await ordersModel.findOne({ _id: id }).populate("userId");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(`error : ${err}`);
  }
};

const createOrder = async (req, res) => {
  var order = req.body;
  try {
    const newOrder = await ordersModel.create(order);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json(`error: ${err}`);
  }
};

const updatingOrders = async (req, res) => {
  var id = req.params.id;
  var updates = req.body;
  console.log(updates);
  try {
    const updatedOrder = await ordersModel.updateOne({ _id: id }, updates);
    res.status(200).json({ updatedOrder });
  } catch (err) {
    res.status(400).json(`error: ${err}`);
  }
};

const cancelOrder = async (req, res) => {
  var id = req.params.id;
  try {
    console.log(id);
    const order = await ordersModel.updateOne({ _id: id } , {status : "canceled"});
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(`error: ${err}`);
  }
};

module.exports = {
  getPastOrderOfOneUser,
  getOneOrderById,
  createOrder,
  updatingOrders,
  cancelOrder,
  getComingOrderOfOneUser,
  getAllOrders: getAllOrdersForAdmin
};
