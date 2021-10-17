const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
    try{
        const user = await User.create(req.body); 
        
        res.status(201).redirect('/login');
    }
    catch (error) {
        res.status(400).json({
            status: 'fail user creation',
            error: error
        });
    }
};

exports.loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne( { email: email } );
        
        if(user) {
            bcrypt.compare(
                password, 
                user.password, 
                (err, same) => {
                    if(same) {
                        req.session.userID = user._id;
                        res.status(200).redirect('/users/dashboard');
                    }
                    else {
                        res.status(400).json({
                            status: 'fail login',
                            error: 'Wrong user credentials!'
                        });
                    }
                    
                }
            );
        }
        
    }
    catch (error) {
        res.status(400).json({
            status: 'fail login',
            error: error
        });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({_id: req.session.userID}).populate('courses');
    const categories = await Category.find();
    const courses = await Course.find({user: req.session.userID}).sort('-dateCreated');

    res.status(200).render('dashboard', {
        page_name: 'dashboard', 
        user: user,
        categories: categories,
        courses: courses 
    });
};