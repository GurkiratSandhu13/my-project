// Now here we will create a schema for user ie for email password and location @GurkiratSinghSandhu

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
});
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel; 