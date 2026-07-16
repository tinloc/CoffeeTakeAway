const Category = require("../models/category.model");

async function getAll() {

    return await Category.findAll();

}

async function getById(id) {

    const category = await Category.findById(id);

    if (!category) {

        throw new Error("Không tìm thấy danh mục.");

    }

    return category;

}

module.exports = {

    getAll,

    getById

};