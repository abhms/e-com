import { NextApiRequest, NextApiResponse } from 'next';
import Product from '../../../models/Product';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import Seller from '../../seller';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const secretKey = process.env.JWT_SECRET!;

    const { productname, selectedProductType, price, description, fileUrl } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    const decodedToken = jwt.verify(token, secretKey) as { userId: string };

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const newProduct = new Product({
      sellerId:user?._id,
      productname, selectedProductType, price, description, fileUrl,deleted:false,
    });
    const sellerUser =await User.findOneAndUpdate({_id:user?._id},{
      seller:true
    })
    await newProduct.save();
    res.status(200).json({ message: 'Product added sucessfully' });
   
  } catch (error) {
    res.status(500).json({ error: 'An internal server error occurred' });
  }
}
