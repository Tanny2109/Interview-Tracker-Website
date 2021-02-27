const { name } = require('admin-bro-expressjs');
const question = require('../models/question');
const topic = require('../models/topic');



const topic_index = (req, res, next) => {
    const response=res;
    topic.find().sort({ createdAt: -1 })
        .then(result => {
            response.render('topics', { topics: result, title: 'All topics' });
            next();
        })
        .catch(err => {
            console.log('The Error is.....');
            console.log(err);
        });
}

const topic_questions = (req, res) => {
    const id = req.params.id;
    question.find({ topic: id }).sort({ createdAt: -1 })
        .then(result => {
            topic.findById(id).then(data => {
                // console.log(data);
                res.render('questions', { questions: result,data: data.name, title: 'All questions' });
            })
        })
        .catch(err => {
            console.log(err);
        });
}

// const question_create_get = (req, res) => {
//     res.render('create', { title: 'Create a new question' });
// }

const question_create_post = (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const new_question = {
        name: req.body.name,
        link: req.body.link,
        topic: id
    }
    const newQuestion = new question(new_question);
    newQuestion.save()
        .then(result => {
            res.redirect('/topics');
        })
        .catch(err => {
            console.log(err);
        });
    // topic.findOne({ name: String(req.body.topic) }).then(result => {
    //     if (result) {
    //         const new_question = {
    //             name: req.body.name,
    //             link: req.body.link,
    //             topic: result._id
    //         }
    //         const newQuestion = new question(new_question);
    //         newQuestion.save()
    //             .then(result => {
    //                 res.redirect('/topics');
    //             });
    //     };
    // });
    // const new_topic = {
    //     name: req.body.topic
    // }
    // const newTopic = new topic(new_topic);
    // newTopic.save()
    //     .then(result => {
    //         topic.findOne({ name: String(req.body.topic) }).then(result => {
    //             // console.log(result._id);
    //             const new_question = {
    //                 name: req.body.name,
    //                 link: req.body.link,
    //                 topic: result._id
    //             }
    //             const newQuestion = new question(new_question);
    //             newQuestion.save()
    //                 .then(result => {
    //                     res.redirect('/topics');
    //                 })
    //         });

    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

}


module.exports = { topic_index, topic_questions, question_create_post }