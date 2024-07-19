import mongoose from 'mongoose';
const { Schema } = mongoose;

const AdminUsersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AdminUsers = mongoose.model('AdminUsers', AdminUsersSchema);

export default AdminUsers;
