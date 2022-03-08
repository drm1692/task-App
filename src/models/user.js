const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task  = require('./task');

//creating user schema
const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
       type: Number,
       default: 20,
       validate(value){
           if(value < 0){
               throw new Error("age must be positive number")
           }
       }
    },
    email: {
        required: true,
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is invalid")
            }
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 7,
        validate(value){
            if(validator.equals(value,"password")){
                throw new Error("password can not cointain password");
  
            }
        }
    },
    tokens: [{

        token: {
            require: true,
            type: String
        }
    }],
    avatar: {
        type: Buffer,
    }
    
        // tasks: {
        //     type: mongoose.Schema.Types.ObjectId, 
        //     ref: 'Task'
        // }
    
},{
    timestamps: true
});
//virtual attribute
// userSchema.virtual('tasks',{
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// });


//return user data
userSchema.methods.toJSON = function(){

    const user  = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    //delete userObject.tasks;
    return userObject;
}
//find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email: email});
    
    if(!user){
        //console.log(user);
        throw new Error("unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
        throw new Error("password incorrect");
    }
    return user;
}
//jwt token

userSchema.statics.generateToken = async function(user){

    try {
        const token = jwt.sign({_id: user._id.toString()}, 'divyMajithiya');
        user.tokens = user.tokens.concat({token: token });
        await user.save();
        return token;
    } catch (error) {
        throw new Error(error)
    }

}

//hash password
userSchema.pre('save', async function(next) {

    const user = this;
    
    if(user.isModified('password')){

        user.password = await bcrypt.hash(user.password,6);
    }

    next();
});
userSchema.pre('remove', async function(next){

    const user = this;
    try{
        await Task.deleteMany({createdBy: user._id});
    }catch(e){
        console.log("Error:", e);
    }
})

const User = mongoose.model('User', userSchema); 

module.exports = User;