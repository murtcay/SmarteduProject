const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID
        });
        
        req.flash('success', `${course.name} has been created successfully.`);
        res.status(201).redirect('/courses');
    } catch (error) {
        req.flash('error', 'Something went wrong!... :(');
        res.status(400).redirect('/courses');
    }
};

exports.getAllCourses = async (req, res) => {
    try {

        const categorySlug = req.query.categories;
        
        const query = req.query.search;
    
        const category = await Category.findOne({slug:categorySlug})
    
        let filter = {};
    
        if(categorySlug) {
          filter = {category:category._id}
        }
    
        if(query) {
          filter = {name:query}
        }
    
        if(!query && !categorySlug) {
          filter.name = "",
          filter.category = null
        }
        
        const courses = await Course.find({
          $or:[
            {
                name: { $regex: '.*' + filter.name + '.*', $options: 'i'}
            },
            {category: filter.category}
          ]
        }).sort('-dateCreated').populate('user');

        const categories = await Category.find();

        res.status(200).render('courses', {
            courses: courses,
            categories: categories,
            page_name: 'courses'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail getting all courses ',
            error: error
        });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        const course = await Course.findOne({slug: req.params.slug}).populate('user');
        const categories = await Category.find();

        res.status(200).render('course-single', {
            course: course,
            page_name: 'courses',
            user: user,
            categories: categories
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail getting a course',
            error: error
        });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.push({_id:req.body.course_id});
        await user.save();
        
        const course =  await Course.findById(req.body.course_id);
        req.flash('success', `Successfully enrolled the course ${course.name}`);

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail enrolling a course',
            error: error
        });
    }
};

exports.releaseCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.pull({_id:req.body.course_id});
        await user.save();

        const course =  await Course.findById(req.body.course_id);
        req.flash('success', `You have successfully release from  ${course.name} course.`);

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail releasing a course',
            error: error
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        console.log('req.params.slug: ',req.params.slug);

        const course = await Course.findOneAndDelete({slug: req.params.slug});
        req.flash('error', `${course.name} has been deleted successfully.`);
        res.status(200).redirect('/users/dashboard');
    
    } catch (error) {
        res.status(400).json({
            status: 'fail deleting a course',
            error: error
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findOne({slug: req.params.slug});
        course.name = req.body.name;
        course.description = req.body.description;
        course.category = req.body.category;
        course.save();

        res.status(200).redirect('/users/dashboard');
    } 
    catch (error) {
        res.status(400).json({
            status: 'fail update the course',
            error: error
        });
    }
};