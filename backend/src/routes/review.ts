import express from "express";
import Review from "../models/review";
import mongoose from "mongoose";

const router = express.Router();

// Tạo một đánh giá mới
router.post('/add', async (req, res) => {
  const { _id, vetId, ownerId, comment, rating } = req.body;

  try {
    const newReview = new Review({
      _id: new mongoose.Types.ObjectId().toString(),
      vetId,
      ownerId,
      comment,
      rating
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});
// Lấy danh sách đánh giá cho một phòng khám thú y
router.get('/rating/show/:vetId', async (req, res) => {
  const { vetId } = req.params;

  try {
    const reviews = await Review.find({ vetId }).populate('ownerId');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});
// Cập nhật một đánh giá
router.put('/update/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { comment, rating } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { comment, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});
// Xóa một đánh giá
router.delete('/delete/:reviewId', async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
