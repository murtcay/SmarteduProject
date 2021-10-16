const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    const course = await Course.create(req.body);
    

    try {
        res.status(201).json({
            status: 'success',
            course: course
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: error
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).render('courses', {
            courses: courses,
            page_name: 'courses'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
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
            status: 'fail',
            error: error
        });
    }
};