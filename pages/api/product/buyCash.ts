import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import OrderedProduct from '../../../models/OrderedProduct';
import Cart from '../../../models/Cart';
interface Address {
    mobileNo: string;
    address: string;
    name: string;
    pincode: string;
    city: string;
    state: string;
}
interface Card {
    nameOnCard: string,
    cardno: string;
    cardtype: string;
    expirydt: string;
    cvv: string
}
interface AllDataItem {
    _id: string;

}
interface Payment {
    payment: string
}

interface RequestBody {
    allData: AllDataItem[];
    address: Address;
    payment: Payment;
    card: Card[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const secretKey = process.env.JWT_SECRET!;
        const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
        const stripe = require('stripe')(STRIPE_SECRET_KEY);
        const { allData, address, card, users } = req.body;

        if (!users) {
            console.log("User not found");
            return res.status(401).json({ error: 'User not found' });
        }
        console.log("User:", users);
        let totalPrice = 0;
        allData.forEach((item: any) => {
            totalPrice += item.price || 0;
        });
        console.log("Total Price:", totalPrice);
        const product = await stripe.products.create({
            name: 'shopnow product',
            description: 'product',
        });

        const stripePrice = await stripe.prices.create({
            unit_amount: totalPrice * 100,
            currency: 'usd',
            product: product.id,
        });

        console.log(stripePrice, "stripePrice");
        const productIds = allData.map((data: any) => data._id);
        await Cart.updateMany(
            {
                UserId: users._id,
                productId: { $in: productIds },
            },
            {
                $pull: { productId: { $in: productIds } }
            }
        );

        const newOrder = new OrderedProduct({
            UserId: users._id,
            ProductId: productIds,
            Address: address,
            Payment: "Card"
        });

        await newOrder.save();
        res.status(200).json({ message: 'Your product is on the way' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}