const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
    try{
        const user = await User.create(req.body); 
        
        res.status(201).redirect('/login');
    }
    catch (error) {

        const errors = validationResult(req);
        let errorMessage = '';
        for (let i = 0; i < errors.array().length; i++) {
            errorMessage += `${errors.array()[i].msg} `;
        }
        req.flash('error', errorMessage);    
        res.status(400).redirect('/register');
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
                        req.flash('error', 'Invalid User Credentials'); 
                        res.status(400).redirect('/login');
                    }
                    
                }
            );
        }
        else {
            req.flash('error', 'Invalid User Credentials'); 
            res.status(400).redirect('/login');
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
    const users = await User.find();

    res.status(200).render('dashboard', {
        page_name: 'dashboard', 
        user: user,
        categories: categories,
        courses: courses,
        users: users
    });
};

exports.deleteUser= async (req, res) => {
    try {
        
        await User.findOneAndDelete({_id: req.params.id});
        await Course.deleteMany({user: req.params.id});

        res.status(200).redirect('/users/dashboard');
    
    } catch (error) {
        res.status(400).json({
            status: 'fail deleting the user',
            error: error
        });
    }
};