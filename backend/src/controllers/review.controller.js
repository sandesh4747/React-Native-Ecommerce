import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    const user = req.user;
    // verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: "No authorized to review this order" });
    }
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Can only review delivered orders" });
    }

    // verify product is in the order
    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString()
    );
    if (!productInOrder) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    // check if review already exists
    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // create review
    const review = await Review.create({
      user: user._id,
      orderId,
      productId,
      rating,
    });
    // update the product rating
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
      },
      { new: true, runValidators: true }
    );

    if (!updateProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.user;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete review" });
    }
    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);
    // update product rating
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
