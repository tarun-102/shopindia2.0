const createProduct  = (req, res) => {
    res.status(201).json({
        success: true ,
        message: "product controller working"
    });
};

module.exports = {
    createProduct,
}