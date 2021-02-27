const mongoose = require('mongoose');
const User = require('./User');

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        // lowercase: true,
    },
    link: {
        type: String,
        require: true,
        // unique: true,
    },
    topic:
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'topic' }],
    approved:
    {
        type: Boolean,
        default: false,
    },
})

const question = mongoose.model('question', questionSchema);
module.exports = question;