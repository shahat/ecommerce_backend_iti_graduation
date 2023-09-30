const wishlistModel = require('../models/wishlist')
const productModel = require('../models/product') 

var getAllWishlistProducts= async (req, res) => {
    var userId = req.body.id // For testing
    // var userId = req.id // Actual code

    if (userId){
        try {
            var data = await wishlistModel.findOne({ userId }).populate()
            res.status(200).json({ data })
        }
        catch(err){
            res.status(404).json({ message: err, a_way_to_fix: "Signup first then send the userId" })
        }
    } else {
        // case a guest tries to get his wishlist before signing up or adding any products
        res.status(404).json({ message: "Must signup first" })
    }
}

var addUserWishlist = async (req, res) => {
    var userId = req.body.id // For testing
    // var userId = req.id // Actual code
    if(!userId){
        res.status(404).json({ message: "Must signup first" })
    } else {
        try{
            var data = await wishlistModel.create({userId, items:[]})
            res.status(201).json({ data })
        } catch(err) {
            if(err.message.includes("duplicate key")){
                // send a message about the Duplicated key
                let message = {
                    cause: `Duplicate ${Object.keys(err.keyValue)[0]}`
                }
                res.status(403).json({ message })
                
            } else {
                res.status(400).json({message: err})
            }
        }
    }
}

var addOneProductToWishlist = async (req, res) => {
    var userId = req.body.id // For testing
    // var userId = req.id // Actual code
    var { productId } = req.body
    if(!userId){
        res.status(404).json({ message: "Must signup first" })
    }
    // adding the product to the users Wish List
    try{
        var selectedProduct = await productModel.findOne({_id: productId})
        var newItem = { _id: productId }
        if(!selectedProduct) // case user was missing with the product id
            res.status(401).json({ message: "Wrong product ID" })

        var check = await wishlistModel.findOne({ userId, 'items._id': { $eq: productId } })
        if (check === null){
            var updateNotification = await wishlistModel.updateOne(
                { userId },
                { $addToSet: { items: newItem } }
            )    
            if (updateNotification.modifiedCount != 0){
                // if the product has been added successfully just respond with the update notification
                res.status(202).json({ data:updateNotification, userId, guest:data.guest })
            }else if(updateNotification.matchedCount === 0){
                res.status(404).json({ message:"Could'n find user with this id" })
            } 
        } else {
            res.status(304).json({ message:"Item already in your Wish List" })
        }
    } catch(err) {
        res.status(401).json({ message: err.message })
    }
}

var deleteOneProductFromWishlist= async (req, res) => {
    var userId = req.body.id // For testing
    // var userId = req.id // Actual code
    var { productId } = req.body
    try{
        var deleteNotification = await wishlistModel.updateOne(
            { userId },
            { $pull: { items: {_id : productId} } }
        )
        res.status(202).json({ data:deleteNotification })
    } catch(err) {
        res.status(401).json({ message: err.message })
    }
}


module.exports = { getAllWishlistProducts, addUserWishlist, addOneProductToWishlist, deleteOneProductFromWishlist }