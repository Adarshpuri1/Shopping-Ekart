import mongoose from "mongoose";
import { Product } from "./productModel.js";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                require: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }

    ],
    totalPrice: {
        type: Number,
        default: 0
    }
},{ timestamps: true});

export const Cart = mongoose.model("Cart", cartSchema);