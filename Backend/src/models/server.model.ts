import mongoose, { Document, Schema, Model, model } from 'mongoose';

interface CloudinaryResponse {
    url: string;
    public_id: string;
    [key: string]: any;  // This allows for any additional properties Cloudinary might include
}

export interface IServer extends Document {
    name: string;
    serverImage: CloudinaryResponse;
    inviteCode: string;
    profileId: string;
    members: mongoose.Types.ObjectId[];
    channels: mongoose.Types.ObjectId[];
}

const serverSchema: Schema<IServer> = new Schema<IServer>({
    name: { 
        type: String, 
        required: true 
    },
    serverImage: { 
        type: Object, 
        required: true 
    },
    inviteCode: { 
        type: String, 
        required: true,
        unique: true,
    },
    profileId: { 
        type: String, 
        ref: 'Profile', 
        required: true 
    },
    members: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Member' }
    ],
    channels: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Channel' }
    ],
}, { 
    timestamps: true, 
});

serverSchema.index({ profileId: 1 });

const Server: Model<IServer> = mongoose.model<IServer>('Server', serverSchema);

export default Server;
