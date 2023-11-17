const express = require("express");
const couponModel = require("../models/coupons");

const getCoupon = async (req, res) => {
  var coupon = req.params.coupon
  try {
    const result = await couponModel.find({coupon : coupon});
    res.status(200).json(result[0].discount);
  } catch (err) {
    res.status(400).json({error:`error : ${err}`, why:"Be"});
  }
};

const creatCoupon = async (req, res) => {
  var coupon = req.body;

  try {
    const result = await couponModel.create(coupon)
    res.status(200).json({ result });
  } catch (err) {
    res.status(400).json(`error : ${err}`);
  }
};



const deleteCoupon = async (req, res) => {
  var id = req.params.id;
  try {
    const result = await couponModel.deleteOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(`error: ${err}`);
  }
};

module.exports = {
    getCoupon,
    creatCoupon,
    deleteCoupon,

};
