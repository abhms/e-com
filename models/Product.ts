import mongoose from "./db";

const ProductSchema = new mongoose.Schema({
    sellerId:String,
    productname: String,
    selectedProductType:String,
    price: Number,
    description: String,
    fileUrl: String,
},
{
  timestamps: true,
});

const Product = mongoose.models.ProductSchema || mongoose.model("ProductSchema", ProductSchema);

export default Product;
