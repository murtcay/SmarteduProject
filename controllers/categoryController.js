const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    const category = await Category.create(req.body);
    

    try {
        res.status(201).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail category creation',
            error: error
        });
    }
};

exports.deleteCategory= async (req, res) => {
    try {
        
        await Category.findOneAndDelete({_id: req.params.id});

        res.status(200).redirect('/users/dashboard');
    
    } catch (error) {
        res.status(400).json({
            status: 'fail deleting the user',
            error: error
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({_id: req.params.id});
        category.name = req.body.name;
        category.save();

        res.status(200).redirect('/users/dashboard');
    } 
    catch (error) {
        res.status(400).json({
            status: 'fail update the category',
            error: error
        });
    }
};