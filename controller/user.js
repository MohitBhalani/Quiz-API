let USER = require('../model/user');
let jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
let bcrypt = require('bcrypt');



exports.Secure = async (req, res, next) => {
    try {
        let token = req.headers.authorization;  // token check for any token not valid token can not to be submitted
        if (!token) throw new Error('Token is missing');

        // Verify token based on role
        let isvalidtoken;
        try {
            isvalidtoken = jwt.verify(token, "admin");
        } catch (error) {
            isvalidtoken = jwt.verify(token, "user");
        }

        if (!isvalidtoken) throw new Error('Token is not valid');

        console.log(isvalidtoken);

        let isuser = await USER.findById(isvalidtoken.id);   // check for user can Contact data (only User show only 1(him data) data not show all data) update, delete and read in database(mongodb)  // id can check only pass in contact router
        if (!isuser) throw new Error('User is not found');

        req.user = isuser; // Attach user to request object

        next();
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
};


// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: "Failed",
            message: "Access denied. Admins only."
        });
    }
    next();
};

// Middleware to check if the user is a regular user
exports.isUser = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({
            status: "Failed",
            message: "Access denied. Users only."
        });
    }
    next();
};


exports.read = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role === 'admin') {
            // Admin can see all users' data
            let data = await USER.find();
            res.status(200).json({
                status: 'success',
                message: 'Data fetched successfully',
                data
            });
        } else {
            // Regular user can only see their own data
            let data = await USER.findById(req.user._id);
            res.status(200).json({
                status: 'success',
                message: 'Data fetched successfully',
                data
            });
        }
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
};



exports.Signup = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        
        let findData = await USER.findOne({ email });
        if (findData) throw new Error("User already exists");
        
        req.body.password = await bcrypt.hash(password, 10);

        let data = await USER.create({
            name,
            email,
            password: req.body.password,
            role: role ? role : 'user'
        });


        res.status(201).json({
            status: "Success",
            message: `${data.role} created successfully`,
            data

        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}


exports.Login = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Find user by email
        let findEmail = await USER.findOne({ email });
        if (!findEmail) throw new Error("Email is not registered! Email is incorrect!");

        let passwordValid = await bcrypt.compare(password, findEmail.password);
        if (!passwordValid) throw new Error("Password is incorrect!");

        // Generate token
        let token;
        if (findEmail.role === 'admin') {
            token = jwt.sign({ id: findEmail._id }, "admin");
        } else {
            token = jwt.sign({ id: findEmail._id }, "user");
        }
        
        // Use findEmail as the user data
        let data = findEmail;

        res.status(200).json({
            status: "Success",
            message: `${findEmail.role} login successfully`,
            data,
            token
        });

        main(findEmail.email)

    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        });
    }
};



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "moonenterprise8989@gmail.com",
        pass: "uzgpevigtvwhwkln", // Use app password, ensure this is securely stored
    },
});

// Nodemailer email sending function
async function main(mail) {
    try {
        const info = await transporter.sendMail({
            from: '"Welcome to Online Quiz Question Answer 👻" <moonenterprise8989@gmail.com>',
            to: mail,
            subject: " Play and Show your Score",   
            text: "Select Your Quiz And Play",
            html: "<b>Thank you for visiting our website</b>",
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
}



exports.update = async (req, res) => {
    try {

        let findData = await USER.findById(req.params.id);
        if (!findData) throw new Error("Data is not found");

        if(req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);

        let data = await USER.findByIdAndUpdate(req.params.id, req.body, { new: true });


        res.status(200).json({
            status: 'success',
            message: `${findData.role} updated successfully`,
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}



exports.delete = async (req, res) => {
    try {

        let findData = await USER.findById(req.params.id);
        if (!findData) throw new Error("Data is not found");

        let data = await USER.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: `${findData.role} deleted successfully`,
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}