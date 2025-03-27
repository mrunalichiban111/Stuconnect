import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDirectMessage extends Document {
    content: string;
    fileUrl: string;
    memberId: string;
    deleted: boolean;
}

const directMessageSchema: Schema<IDirectMessage> = new Schema<IDirectMessage>({
    content: { 
        type: String, 
        required: true 
    },
    fileUrl: { 
        type: String, 
    },
    memberId: { 
        type: String, 
        ref: 'Member', 
        required: true 
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true, 
});

directMessageSchema.index({ memberId: 1 });
directMessageSchema.index({ channelId: 1 });

const DirectMessage: Model<IDirectMessage> = mongoose.model<IDirectMessage>('DirectMessage', directMessageSchema);

export default DirectMessage;
