const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true        
    },

    password: {
        type: String,
        required: true
    },
    pic: {
        type: "String",
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    }, {
        timestamps: true
    });

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function(next){
    // only run this function of the password is modified
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;