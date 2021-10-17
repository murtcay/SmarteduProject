const Course = require('../models/Course');
const Category = require('../models/Category');

exports.createCourse = async (req, res) => {
    const course = await Course.create(req.body);
    
    try {
        res.status(201).redirect('/courses');
    } catch (error) {
        res.status(400).json({
            status: 'fail course creation',
            error: error
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {

        const categorySlug = req.query.categories;
        const category = await Category.findOne({slug: categorySlug});

        let filter = {};

        if(categorySlug) {
            filter = {category: category._id};
        }

        const courses = await Course.find(filter).sort('-dateCreated');
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
        const course = await Course.findOne({slug: req.params.slug});
        res.status(200).render('course-single', {
            course: course,
            page_name: 'courses'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail getting a course',
            error: error
        });
    }
};