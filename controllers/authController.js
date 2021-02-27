const User = require('../models/User');
const jwt = require('jsonwebtoken');



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