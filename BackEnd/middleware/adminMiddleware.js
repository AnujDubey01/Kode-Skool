const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, msg: "Authentication required." });
        }

        // Check token role first, fallback to DB query to ensure fresh verification
        if (req.user.role === 'Admin') {
            return next();
        }

        const user = await User.findById(req.user.id);
        if (!user || user.User_Type !== 'Admin') {
            return res.status(403).json({ success: false, msg: "Access denied. Admin privileges required." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = adminMiddleware;
