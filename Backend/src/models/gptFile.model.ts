import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IGPTfile extends Document {
    fileName: string;
    pineconeNamespace: string;
    userId: string,
}

const GPTfileSchema: Schema<IGPTfile> = new Schema<IGPTfile>({
    fileName: { 
        type: String, 
        required: true,
    },
    pineconeNamespace: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: String, 
        required: true 
    },
}, { 
    timestamps: true, 
});

const GPTfile: Model<IGPTfile> = mongoose.model<IGPTfile>('GPTfile', GPTfileSchema);

export default GPTfile;
