const mongoose = require("mongoose");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const jwt = require("jsonwebtoken");

var userIdFromBody = (req) => {
    console.log(req);
    var userId;
    const { token, token2 } = req.body;
    if (token) {
        userId = jwt.decode(token).id;
    } else if (token2) {
        userId = token2.userId;
    }
    return userId;
};
var userIdFromParams = (req) => {
  var userId;
  const { token, token2 } = req.params;
  if (token) {
    userId = jwt.decode(token).id;
  } else if (token2) {
    userId = token2.userId;
  }
  return userId;
};
var userIdFromHeaders = (req) => {
    var userId, cartId, res;
    const { token } = req.headers;
    if (token) {
        try {
            userId = jwt.decode(token).id;
            // console.log("=>",userId);
            res = { userId }
            // console.log(res);
        } catch (err) {
            userId = JSON.parse(token).userId;
            cartId = JSON.parse(token).cartId;
            res = {userId, cartId}
        }
    }
    // console.log("s",res);
    return res;
};

var getAllCartProducts = async (req, res) => {
    var temp = userIdFromHeaders(req);
    var userId = temp? temp.userId : undefined
// console.log(1);
    if (userId) {
        try {
            var data = await cartModel
                .findOne({ userId })
                .populate(
                    "items._id",
                    "title quantity price discountPercentage priceAfterDescount description thumbnail "
                );
            res.status(200).json({ data });
        } catch (err) {
            res.status(404).json({ message: err });
        }
    } else {
        // case a guest tries to get his empty cart before signing up or adding any products
        res.status(404).json({ message: "you don't have a cart" });
    }
};

var addUserCart = async (req, res) => {
    var { userId, cartId } = userIdFromHeaders(req);
console.log(2);
    if (!userId) res.status(401).json({ message: "Unknown User" });

  if (cartId) {
    // transferring the guest cart to the registered user
    try {
      var data = await cartModel.updateOne(
        { _id: cartId },
        { userId, guest: false }
      );
      res.status(201).json({ data });
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  } else {
    try {
      var data = await cartModel.create({ userId, items: [] });
      res.status(201).json({ data });
    } catch (err) {
      if (err.message.includes("duplicate key")) {
        // ERROR Handler: case if it accidentally created a userId that is used for a guest:=>
        // delete it and create a new one for the user
        if (Object.keys(err.keyValue).includes("userId")) {
          // Get the Duplicated cart
          var check = await cartModel.findOne({ userId });
          // check if it is for another guest to replace it
          if (check.guest) {
            // case a guest signed up change it to not guest
            try {
              var data = await cartModel.replaceOne(
                { userId },
                { userId, items: [] }
              );
              res.status(201).json({
                data,
                To_Whom_It_May_Concern: "I just replaced a guest cart",
              });
            } catch (err) {
              res.status(403).json({ message: err.message });
            }
          } else {
            res.status(403).json({ message: err });
          }
        } else {
          // send a message about the Duplicated key
          let message = {
            cause: `Duplicate ${Object.keys(err.keyValue)[0]}`,
          };
          res.status(403).json({ message });
        }
      } else {
        res.status(400).json({ message: err });
      }
    }
  }
};

var addOneProductToCart = async (req, res) => {
    var temp = userIdFromHeaders(req);
    var userId = temp? temp.userId : undefined
console.log(3);
    var { quantity } = req.body;
    var { productId } = req.params;
    var data = { guest: false };
    // case a guest added to cart===============>
    // create a guest cart then add to it
    if (!userId) {
        try {
            userId = mongoose.Types.ObjectId();
            data = await cartModel.create({ userId, guest: true, items: [] });
        } catch (err) {
            if (err.message.includes("duplicate key")) {
                let message = {
                    cause: `Duplicate ${Object.keys(err.keyValue)[0]}`,
                    message: "try it one more time",
                };
                res.status(403).json({ message });
            } else {
                res.status(400).json({ message: err });
            }
        }
    }
    // adding the product to the users cart
    try {
        var selectedProduct = await productModel.findOne({ _id: productId });
        var newItem = {
            _id: productId,
            priceWhenAdded: selectedProduct.price,
            quantity,
        };
        var check = await cartModel.findOne({
            userId,
            "items._id": { $eq: productId },
        });
        if (check === null) {
            var updateNotification = await cartModel.updateOne(
                { userId },
                { $addToSet: { items: newItem } }
            );
            if (updateNotification.modifiedCount != 0) {
                // if the product has been added successfully just respond with the update notification
                res.status(202).json({
                    data: updateNotification,
                    // userId,
                    // guest: data.guest,
                    data,
                });
            } else if (updateNotification.matchedCount === 0) {
                res.status(404).json({
                    message: "Could'n find user with this id",
                });
            }
        } else {
            var updateNotification = await cartModel.updateOne(
                { userId, "items._id": productId },
                { $inc: { "items.$.quantity": 1 } }
            );
            res.status(203).json({
                message: "We added another item of this Product to your cart",
                userId,
            });
        }
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

var modifyOneProductFromCart = async (req, res) => {
    var temp = userIdFromHeaders(req);
    var userId = temp? temp.userId : undefined
console.log(4);
    var { productId, quantity, priceWhenAdded } = req.body;
    if (!productId) {
        res.status(401).json({ message: "Must provide the product id" });
    } else {
        try {
            var { items } = await cartModel.findOne(
                { userId, "items._id": { $eq: productId } },
                { items: 1, _id: 0 }
            );
            for (var product of items) {
                if (product._id === productId) {
                    if (!quantity) {
                        quantity = product.quantity;
                    }
                    if (!priceWhenAdded) {
                        priceWhenAdded = product.priceWhenAdded;
                    }
                }
            }
        } catch (error) {}
    }
    try {
        var updateNotification = await cartModel.updateOne(
            { userId, "items._id": productId },
            {
                $set: {
                    "items.$.quantity": quantity,
                    "items.$.priceWhenAdded": priceWhenAdded,
                },
            }
        );
        res.status(202).json({ data: updateNotification });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

var removeOneProductFromCart = async (req, res) => {
    // console.log("why",userIdFromHeaders(req));
    var userId = userIdFromBody(req);
    // var userId = temp? temp.userId : undefined
    // console.log("remove", userId);
console.log(5,userId);
    var { productId } = req.params;
    try {
        var deleteNotification = await cartModel.updateOne(
            { userId },
            { $pull: { items: { _id: productId } } }
        );
        res.status(202).json({ data: deleteNotification });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

var deleteUserCart = async (req, res) => {
    var { userId } = userIdFromBody(req);

  try {
    var deleteNotification = await cartModel.deleteOne({ userId });
    res.status(202).json({ data: deleteNotification });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  getAllCartProducts,
  addOneProductToCart,
  modifyOneProductFromCart,
  removeOneProductFromCart,
  addUserCart,
  deleteUserCart,
};
