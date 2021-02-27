const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Enter name.']
    },
    email: {
        type: String,
        required: [true,'Email not entered.'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true,'Password not entered.'],
        minlength: [8,'Password too short. Minimum length is 8 characters.'],

    }
});

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({ email });
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user; 
        }
        throw Error('Incorrect Password');
    }
    throw Error('Email not regestered. Please Sign-in');
}

const User = mongoose.model('user',userSchema);

module.exports=User;