const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    const category = await Category.create(req.body);
    

    try {
        res.status(201).json({
            status: 'success',
            category: category
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail category creation',
            error: error
        });
    }
};