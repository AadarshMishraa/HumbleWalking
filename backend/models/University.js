import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    logo: {
        type: String
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    faculty: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    contactInfo: {
        email: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const University = mongoose.model('University', universitySchema);

export default University;
