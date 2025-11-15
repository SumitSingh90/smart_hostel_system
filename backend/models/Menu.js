const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  mealType: { type: String, enum: ['lunch','dinner'], required: true },
  items: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
