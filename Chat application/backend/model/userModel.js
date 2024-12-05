import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true  // corrected from 'require' to 'required'
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true  // corrected from 'require' to 'required'
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: 'male'
    },
    address: { // null value if value is not provided 
        type: String,
        default: '',
    },
    website: { // null value if value is not provided 
        type: String,
        default: '',
    },
    phone: { // null value if value is not provided 
        type: String,
        default: '',
    },
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'  // It should be the model name ('User' should be capitalized if it's the same model name)
    }],
    following: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'  // Same here, 'User' should match the model name
    }],

    post: [{
        type:mongoose.Types.ObjectId,
        ref:'Post'
    }]
}, {
    timestamps: true  // corrected 'timestamp' to 'timestamps'
});


const userModel = mongoose.model('User', userSchema);  
export default userModel;
