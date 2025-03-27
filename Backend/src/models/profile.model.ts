import mongoose, { Document, Schema, Model, model } from 'mongoose';

export interface IProfile extends Document {
    userId: string;
    username: string;
    imageUrl: string;
    email: string;
    servers: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
    channels: mongoose.Types.ObjectId[];
}

const profileSchema: Schema<IProfile> = new Schema<IProfile>({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    username: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String, 
    },
    email: { 
        type: String, 
        required: true 
    },
    servers: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Server' 
        }
    ],
    members: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Member' 
        }
    ],
    channels: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Channel' 
        }
    ],
}, { 
    timestamps: true 
});

const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', profileSchema);

export default Profile;
