const User = require('../models/User');
const jwt = require('jsonwebtoken');
const topic = require('../models/topic');



//function to handle errors------------------------------------------------------------------------------------------------------------------
const handleErr = err =>{
    console.log(err.message,err.code);
    let errors = { email: '', password: '', name: ''};

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            //console.log(properties);
            errors[properties.path]=properties.message;
        });
    }

    //Log-in errors--------------------------------------------------------------------------------------------------------------
    if(err.message.includes('Email not regestered. Please Sign-in')){
        errors.email = 'Email not regestered. Please Sign-in';
    }
    if(err.message.includes('Incorrect Password')){
        errors.password = 'Password is incorret. Please re-enter';
    }

    if(err.code===11000){
        errors["email"]='User already regestered. PLease log-in';
        return errors;
    }

    return errors;
}

//jwt tokens------------------------------------------------------------------------------------------------------------------------------
const maxAge = 3*24*60*60;
const createTokens = (id)=>{
    return jwt.sign({ id }, 'Tanmay Kami-sama', {
        expiresIn: maxAge
    });
}

module.exports.signup_get=(req,res)=>{
    res.render('signup');
}

module.exports.login_get=(req,res)=>{
    res.render('login');
}

module.exports.signup_post=async (req,res)=>{
    const {name,email, password} = req.body;
    
    try{
        const user = await User.create({name,email,password});
        const token = createTokens(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3*24*60*60*1000});
        res.status(201).json({user: user._id});
    }catch(err){
        const errors=handleErr(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post=async (req,res)=>{
    const {email, password} = req.body;

    try{
        const user = await User.login(email,password);  
        const token = createTokens(user._id);
        res.cookie('jwt',token,{ httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({ user: user._id });
    }catch(err){
        const errors = handleErr(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = async (req,res) => {
    res.cookie('jwt','',{ maxAge: 0.5});
    res.redirect('/');
}

//for forms, questions, topics

module.exports.form_get = async (req,res) => {
    const topics = {};
    const all = await topic.find(topics);
    res.render('forms', {topics: all});
}

module.exports.form_post = async (req, res) => {
    const {name, topic, link} = req.body;
    const approved = isAdmin(req, res);
    var topicId;
    await Topic.find({name : topic}).then((result) => topicId = result[0]._id);
    console.log("name : ", name, topic, link, approved);
    try {
      const quest = await Quest.create({topic : topicId, name, link, approved});
      res.status(201).json({quest : quest._id});
    }
    catch(err) {
      console.log(err);
      res.status(401).json({err});
    }
}

module.exports.get_question_by_name = (req, res) => {
    const name = req.params.name;
    let id;
    console.log("name ," ,name);
    Quest.find({name : name}).then((result) => {
      res.redirect(result[0].link);
    })
  
}
  
  module.exports.get_question_by_topicsName = async (req, res) => {
    const id = req.params.id;
    console.log("id = ", id);
    var TopicId = 23, iconName;
    console.log(TopicId);
    await Topic.find({name : id}).then((result) =>  {TopicId = result[0]._id; iconName = result[0].iconName});
    console.log("Id = ", TopicId);
    Quest.find({topic : TopicId}).then((result) => {
      console.log("questions : ", result);
      res.render('all_questions', {questions : result, iconName});
    })
    .catch((error) => console.log(error));
 
  }
  
  //Interview Experience

const Company = require('../models/Company');
const Experience = require('../models/experience');

module.exports.interview_get = async (req, res) => {

  await Company.find({}, (err, item) => {
    if (err){
        console.log(err);
    }
    else {
        res.render('interview/home', {items : item});
    }
}).catch((err) => console.log("erro = ", err));

}

module.exports.company_get = async (req, res) => {
  const result = await Company.find({});
  res.render('interview/company', {companiess : result});
}

module.exports.user_updation_get = (req, res) => {
  res.render('interview/userUpdation');
}

module.exports.experience_get = (req, res) => {
  res.render('interview/experience');
}
module.exports.add_experience = (req, res) => {
  const branches = ['CSE', 'MNC', 'ECE', 'EE', 'CST', 'EP', 'MT', 'CE', 'BT'];
  Company.find({}).then(result => res.render('interview/add_experience', {companies : result, branches}));
}
module.exports.add_experience_post = async (req, res) => {

  const {year, branch, company, experience} = req.body;
  const user = res.locals.user;
  const approved = isAdmin(req, res);
  var companyId = await Company.find({name : company});
  companyId = companyId[0]._id;
  var obj = {user, year, branch, company : companyId, experience, approved};
  try {
    const exper = await Experience.create(obj);
    console.log("exper : ", exper);
    res.redirect('/');
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}
module.exports.show_experience = async (req, res) => {
  let name = req.params.name;
  let allUser = new Array();
  let company = await Company.find({name : name});
  const allExperience = await Experience.find({company : company[0]._id, approved : true});
  for (let i = 0; i < allExperience.length ; i++) {
    if (allExperience[i].approved) {
      let user = await User.findById(allExperience[i].user);
      allUser.push(user);
    }
  }
  console.log("org url : ", req.originalUrl);
  res.render('interview/show_experiences',{experiences : allExperience, company: company[0], allUser})
}

module.exports.get_full_story = async (req, res) => {
  let name = req.params.name;
  const id = req.params.id;
  let allUser = new Array();
  let company = await Company.find({name : name});
  const allExperience = await Experience.find({_id : id});
  for (let i = 0; i < allExperience.length ; i++) {
    if (allExperience[i].approved) {
      let user = await User.findById(allExperience[i].user);
      // console.log("user = ", user);
      allUser.push(user);
    }
  }
  res.render('interview/full_story',{experiences : allExperience, company: company[0], allUser})
  
}