import mongoose from 'mongoose';
const { Schema } = mongoose;

const DeveloperSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        // required: true,
        default: "Image",
    },
    desc: {
        type: String,
        required: true,
    },
    estIn: {
        type: String,
        required: true,
    },
    totalProject: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Developer = mongoose.model('developer-details', DeveloperSchema);

export default Developer;
