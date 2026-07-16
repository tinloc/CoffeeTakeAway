const Size = require("../models/size.model");

async function getAllSizes() {

    return await Size.findAll();

}

module.exports = {

    getAllSizes

};