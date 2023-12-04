const usersModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate token
function generateToken(id) {
    return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: 7200, // 2h
    });
}

var userIdFromHeaders = (req) => {
    var userId;
    const { token } = req.headers;
    if (token) {
        try {
            userId = jwt.decode(token).id;
        } catch (err) {
            console.log(err);
        }
    }
    return userId;
};

/* =========================== get Admin =========================== */

const getOneAdmin = async (req, res) => {
    let id = userIdFromHeaders(req);
    try {
        let admin = await usersModel.findOne({ _id: id, role: "admin" });
        res.status(200).json({ admin });
    } catch (err) {
        res.status(404).json({ message: "Cant find this ID " });
    }
};

/* =========================== modifyAdmin =========================== */

const modifyAdmin = async (req, res) => {
    let id = userIdFromHeaders(req);
    var updates = req.body;
    try {
        let updateNotification = await usersModel.updateOne(
            { _id: id, role: "admin" },
            updates
        );
        if (updateNotification.modifiedCount === 1) {
            // if the product has been added successfully just respond with the update notification
            res.status(202).json({
                status: updateNotification,
            });
        } else if (updateNotification.matchedCount === 0) {
            res.status(404).json({
                message: "Could'n find admin with this id",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: ` Error in update the document : ${err}`,
        });
    }
};
/* =========================== Delete one Admin =========================== */

const removeAdmin = async (req, res) => {
    let { id } = req.params;
    try {
        let admin = await usersModel.deleteOne({ _id: id, role: "admin" });
        res.status(200).json({ admin });
    } catch (err) {
        res.status(500).json({ message: " Error in deleting the Admin" });
    }
};

/* =========================== signUp =========================== */

const addAdmin = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "please provide your email " });
    }
    const user = await usersModel.findOne({ email });
    const admin = await usersModel.findOne({ email, role: "admin" });
    try {
        if (admin) {
            return res.status(400).json({
                message:
                    " This email is already assigned as Admin. You can use it to login to the dashboard. ",
            });
        } else if (user) {
            return res.status(400).json({
                message:
                    " This email is used for a user account. Choose another email ",
            });
        }
        const newUser = await usersModel.create(req.body);
        const token = generateToken(newUser._id);
        res.cookie("authenticate", token);
        return res.status(201).json({
            token: token,
            message: ` ${req.body.name} was added successfully as Admin`,
            data: { user: newUser },
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// // =========================== Login ===========================

const login = async (req, res) => {
    console.log(req);
    const { email, password } = req.body;
    // Check if email & password are present in the request body
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide your email and password" });
    }
    // Check if the user with the given email exists in our DB
    const admin = await usersModel
        .findOne({ email, role: "admin" })
        .select("+password");
    if (!admin) {
        return res.status(404).json({
            message: "Provided Admin does not exist, please register first",
        });
    }
    try {
        const isValid = await bcrypt.compare(password, admin.password);
        // console.log(isValid);
        console.log("password", password);
        // console.log("userPassword", admin.password);

        if (!isValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
        console.log("status(200)");
        res.status(200).json({
            token: generateToken(admin._id),
            expires_at: 7200,
        });
    } catch (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getOneAdmin,
    addAdmin,
    login,
    modifyAdmin,
    removeAdmin,
};
