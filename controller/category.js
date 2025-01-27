let CATEGORY = require('../model/category');

exports.createCategory = async (req, res) => {
    try {

        let { name, description } = req.body;

        if (!name || !description) throw new Error("All fields are required!  Name and Description");

        let data = await CATEGORY.create({
            name,
            description
        })

        res.status(201).json({
            status: "Success",
            message: "Category Created Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}


exports.readCategory = async (req, res) => {
    try {

        let findData
        if (req.query.search) {
            findData = await CATEGORY.find({ 
                name: { $regex: req.query.search, $options: 'i' } 
            });
            
        } else {
            
            findData = await CATEGORY.find();
        }

        res.status(200).json({
            status: "Success",
            message: "Category Read Successfully",
            findData
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}


exports.updateCategory = async (req, res) => {
    try {

        let categoryId = req.params.id;

        let category = await CATEGORY.findById(categoryId);
        if (!category) throw new Error("Category not found");

        let data = await CATEGORY.findByIdAndUpdate(req.params.id,req.body, { new: true });


        res.status(200).json({
            status: "Success",
            message: "Category Updated Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        
        let categoryId = req.params.id;

        let category = await CATEGORY.findById(categoryId);
        if (!category) throw new Error("Category not found");

        let data = await CATEGORY.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "Success",
            message: "Category Deleted Successfully",
            data
        })
    } catch (error) {
        res.status(404).json({
            status: "Failed",
            message: error.message
        })
    }
}