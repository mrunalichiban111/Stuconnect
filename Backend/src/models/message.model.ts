import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
    content: string;
    fileUrl: string;
    memberId: string;
    channelId: string;
    deleted: boolean;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>({
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
    channelId: { 
        type: String, 
        ref: 'Channel', 
        required: true 
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true, 
});

messageSchema.index({ memberId: 1 });
messageSchema.index({ channelId: 1 });

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
