const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const run = require('./admin/connection');
const authController = require('./controllers/authController');
const {reqAdminAuth} = require('./middleware/authAdmin');

const app = express();

// middleware
app.use(express.static(__dirname+"/public"))
app.use(express.json());
app.use(cookieParser());
const options = require('./admin/admin.options');
const {default : AdminBro} = require('admin-bro');
const buildAdminRouter = require('./admin/admin.router');
const port = 3000;
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://tanmay-sutar:hansipansi21@cluster0.mlwfc.mongodb.net/interview-website';
let mongooseDb;

const dbConnect = async () => {
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("we are connected to database");
    });

    const admin = new AdminBro(options)
    const router = buildAdminRouter(admin);
    app.use(admin.options.rootPath, router);
};

dbConnect();


// routes
app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/admin', reqAdminAuth);
app.get('/smoothies', requireAuth ,(req, res) => res.render('smoothies'));
//app.get('/topics', requireAuth);
//app.get('/userUpdation',requireAuth, authController.user_updation_get);
app.use('/topics', requireAuth, topicRoutes);
app.get('/topics/:id', requireAuth, authController.get_question_by_topicsName);
app.get('/questions/:name', requireAuth, authController.get_question_by_name);
app.get('/form', requireAuth, authController.form_get);
app.post('/form', requireAuth, authController.form_post);
app.get('/interviews', requireAuth, authController.interview_get);
app.get('/temp',requireAuth, (req, res) => res.render('temp'));
app.use(authRoutes);


//Interview page routes
app.get('/add_experience', requireAuth, authController.add_experience);
app.get('/interviews/:name', requireAuth, authController.show_experience);
app.post('/add_experience', requireAuth, authController.add_experience_post);
app.get('/:name/:id', requireAuth, authController.get_full_story);

const userController = require('./controllers/userController');
app.use(userController);