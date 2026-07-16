const SizeService = require("../services/size.service");

exports.getAll = async (req, res) => {

    try {

        const data = await SizeService.getAllSizes();

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