import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate(
      "items.product"
    );
    if (!cart) {
      const user = req.user;
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error in getCart Controller", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    // validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    let cart = await Cart.findOne({ clerkId: req.user.clerkId });

    if (!cart) {
      const user = req.user;
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }
    // check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      existingItem.quantity = newQuantity;
    } else {
      // add new item to cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart Controller", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    // check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Item quantity updated", cart });
  } catch (error) {
    console.error("Error in updateCartItem Controller", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error in removeFromCart Controller", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ clerkId: req.user.clerkId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error("Error in clearCart Controller", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
