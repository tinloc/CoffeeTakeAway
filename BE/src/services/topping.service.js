const Topping = require("../models/topping.model");

async function getAll() {

    return await Topping.findAll();

}

async function getById(id) {

    const topping = await Topping.findById(id);

    if (!topping) {

        throw new Error("Không tìm thấy topping.");

    }

    return topping;

}

async function getByProduct(productId) {

    return await Topping.findByProduct(productId);

}

module.exports = {

    getAll,

    getById,

    getByProduct

};