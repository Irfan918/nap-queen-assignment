import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  category_id: string;
  
}

const postSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  category_id: { type: String, required: true },
});

export default mongoose.model<IPost>('Post', postSchema);
