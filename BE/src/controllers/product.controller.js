const ProductService = require("../services/product.service");

// ==========================================
// GET /products
// ==========================================
exports.getAllProducts = async (req, res) => {

    try {

        const products = await ProductService.getAllProducts();

        res.json({
            success: true,
            total: products.length,
            data: products
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// GET /products/:id
// ==========================================
exports.getProductById = async (req, res) => {

    try {

        const product = await ProductService.getProductById(
            req.params.id
        );

        res.json({
            success: true,
            data: product
        });

    } catch (err) {

        res.status(404).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// GET /products/search
// ==========================================
exports.searchProducts = async (req, res) => {

    try {

        const keyword = req.query.q;

        const products =
            await ProductService.searchProducts(keyword);

        res.json({
            success: true,
            total: products.length,
            data: products
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ==========================================
// GET /products/category/:id
// ==========================================
exports.getByCategory = async (req, res) => {

    try {

        const products =
            await ProductService.getByCategory(req.params.id);

        res.json({
            success: true,
            total: products.length,
            data: products
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getProductDetail = async (req,res)=>{

    try{

        const data=
        await ProductService.getProductDetail(
            req.params.id
        );

        res.json({

            success:true,

            data

        });

    }

    catch(err){

        res.status(404).json({

            success:false,

            message:err.message

        });

    }

};

exports.getFeatured = async(req,res)=>{

    const data =
    await ProductService.getFeaturedProducts();

    res.json({
        success:true,
        total:data.length,
        data
    });

};

exports.getNewest = async(req,res)=>{

    const data =
    await ProductService.getNewestProducts();

    res.json({
        success:true,
        total:data.length,
        data
    });

};

exports.getBestSelling = async(req,res)=>{

    const data =
    await ProductService.getBestSellingProducts();

    res.json({
        success:true,
        total:data.length,
        data
    });

};

exports.getBySlug = async(req,res)=>{

    try{

        const data=
        await ProductService.getProductBySlug(
            req.params.slug
        );

        res.json({
            success:true,
            data
        });

    }catch(err){

        res.status(404).json({
            success:false,
            message:err.message
        });

    }

};

exports.getRelated = async(req,res)=>{

    try{

        const data=
        await ProductService.getRelatedProducts(
            req.params.id
        );

        res.json({

            success:true,

            total:data.length,

            data

        });

    }catch(err){

        res.status(404).json({

            success:false,

            message:err.message

        });

    }

};