import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IConversation extends Document {
    memberIdOne: string;
    memberIdTwo: string;
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
    memberIdOne: { 
        type: String, 
        ref: 'Member', 
        required: true 
    },
    memberIdTwo: { 
        type: String,
        ref: 'Member',
        required: true 
    },
}, { 
    timestamps: true, 
});

conversationSchema.pre('save', function(next) {
    if (this.memberIdOne > this.memberIdTwo) {
        // Swap the member IDs to ensure consistent ordering
        const temp = this.memberIdOne;
        this.memberIdOne = this.memberIdTwo;
        this.memberIdTwo = temp;
    }
    next();
});

conversationSchema.index({ memberIdOne: 1, memberIdTwo: 1 }, { unique: true });

const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
