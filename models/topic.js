const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        // lowercase: true,
    },
})

const topic = mongoose.model('topic', topicSchema);
module.exports = topic;