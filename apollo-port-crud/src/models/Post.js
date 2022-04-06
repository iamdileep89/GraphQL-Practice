import { model, Schema } from 'mongoose';
import pagtinator from 'mongoose-paginate-v2';

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    featuredImage: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true});

PostSchema.plugin(pagtinator);

const Post = new model('posts', PostSchema);
export default Post;