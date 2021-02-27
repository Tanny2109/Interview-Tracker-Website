const express = require('express');
const topicController = require('../controllers/topicController');

const router = express.Router();
// router.get('/create', topicController.question_create_get);
router.get('/', topicController.topic_index);
router.post('/:id', topicController.question_create_post);
router.get('/:id', topicController.topic_questions);
module.exports = router;