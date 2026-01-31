import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, resp) => {
  try {
    const userId = req.id;
   
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return resp.status(404).json({
        success: false,
        message: "Cart not found",
        cart: [],
      });
    }

    return resp.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, resp) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    if (!productId) {
      return resp.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return resp.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.productPrice,
          },
        ],
        totalPrice: product.productPrice,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return resp.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE QUANTITY
========================= */
export const updateQuantity = async (req, resp) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    if (!productId || !type) {
      return resp.status(400).json({
        success: false,
        message: "productId and type are required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return resp.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return resp.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.productId.toString() !== productId
        );
      }
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return resp.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REMOVE FROM CART
========================= */
export const removeFromCart = async (req, resp) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    if (!productId) {
      return resp.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return resp.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    return resp.status(200).json({
      success: true,
      message: "Product removed successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return resp.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
