module.exports = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.role.toLowerCase();
        if(roles.includes(userRole)) {
            next();
        }
        else {
            return res.status(401).json({
                status: 'fail',
                error: 'Unknown user role!'
            });
        }
    };
};