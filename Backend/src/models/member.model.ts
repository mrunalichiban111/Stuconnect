import mongoose, { Document, Schema, Model } from 'mongoose';

export enum MemberRole {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    GUEST = 'GUEST'
}

export interface IMember extends Document {
    role: MemberRole;
    profileId: string;
    serverId: string;
    messages: mongoose.Types.ObjectId[];
    directMessages: mongoose.Types.ObjectId[];
    conversationInitiated: mongoose.Types.ObjectId[];
    conversationReceived: mongoose.Types.ObjectId[];
}

const memberSchema: Schema<IMember> = new Schema<IMember>({
    role: { 
        type: String, 
        enum: MemberRole, 
        default: MemberRole.GUEST 
    },
    profileId: { 
        type: String, 
        ref: 'Profile', 
        required: true 
    },
    serverId: { 
        type: String, 
        ref: 'Server', 
        required: true 
    },
    messages: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Message' 
        }
    ],
    directMessages: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'DirectMessage' 
        }
    ],
    conversationInitiated: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Conversation' 
        }
    ],
    conversationReceived: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Conversation' 
        }
    ],
}, { 
    timestamps: true, 
});

memberSchema.index({ profileId: 1 });
memberSchema.index({ serverId: 1 });

const Member: Model<IMember> = mongoose.model<IMember>('Member', memberSchema);

export default Member;
