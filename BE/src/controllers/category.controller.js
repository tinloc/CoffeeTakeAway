const CategoryService = require("../services/category.service");

exports.getAll = async (req, res) => {

    try {

        const data = await CategoryService.getAll();

        res.json({

            success: true,

            total: data.length,

            data

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getById = async (req, res) => {

    try {

        const data = await CategoryService.getById(req.params.id);

        res.json({

            success: true,

            data

        });

    }

    catch (err) {

        res.status(404).json({

            success: false,

            message: err.message

        });

    }

};