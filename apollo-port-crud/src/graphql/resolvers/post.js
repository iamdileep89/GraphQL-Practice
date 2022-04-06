import { ApolloError } from "apollo-server-errors";
import { NewPostRules } from "../../validators";


const myCustomLabels = {
    totalDocs: 'postCount',
    docs: 'posts',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
};


export default {
    Query: {
        getAllPosts: async (parent, args, context, info) => {
            const { Post } = context;
            let posts = await Post.find().populate('author');
            return posts;
        },
        getPostById:  async (parent, args, context, info) => {
            try {
                const { Post } = context;
                const { id } = args;
                let post = await Post.findById(id).populate('author');
                if(!post){
                    throw new Error("Post Not Found!")
                };
                return post;
            } catch (error) {
                return new ApolloError(error.message, 400)
            }
            
        },
        getPostByLimitAndPage: async (parent, args, context, info) => { 
            const { page, limit } = args;
            const { Post } = context;
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: myCustomLabels,
                sort: { createdAt: -1 },
                populate: 'author'
            };
            let posts = await Post.paginate({}, options);
            return posts;
        },
        getAuthenticatedUserPosts: async (parent, args, context, info) => { 
            const { page, limit } = args;
            const { Post, user } = context;
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: myCustomLabels,
                sort: { createdAt: -1 },
                populate: 'author'
            };
            let posts = await Post.paginate({ author: user._id.toString() }, options);
            return posts;
        }
    },
    Mutation: {
        createNewPost: async (parent, args, context, info) => {
            const { Post, user } = context;
            const { newPost } = args;
            await NewPostRules.validate(newPost, { abortEarly:false });
            const result = await Post.create({...newPost, author: user._id});
            await result.populate('author');
            return result;
        },
        editPostByID: async (parent, args, context, info) => { 
            const { Post, user } = context;
            const { id, updatedPost } = args;
            await NewPostRules.validate(updatedPost, { abortEarly:false });
            try {
                let result = await Post.findOneAndUpdate({ 
                    _id: id,
                    author: user.id.toString()
                }, {
                    ...updatedPost
                }, {
                    new: true
                });
                if(!result){
                    throw new Error("You cannot edit the Post!")
                }
                return result;
            } catch (error) {
                return new ApolloError(error.message, 400)
            }
        },
        deletePostByID: async(parent, args, context, info) => {
            try {
                const { Post, user } = context;
                const { id } = args;
                let result = await Post.findOneAndDelete({
                    _id: id,
                    author: user._id.toString()
                });
                if(!result){
                    throw new Error("You cannot delete the Post!")
                }
                return {
                    id: result.id,
                    success: true,
                    message: "Your Post is deleted!"
                }
            } catch (error) {
                return new ApolloError(error.message, 400)
            }   
        }
    }
}



// app.get('/posts', async (req, res) => {
//     let { Post } = AppModels;
//     let { page, limit }= req.query
//     const myCustomLabels = {
//         totalDocs: 'postCount',
//         docs: 'posts',
//         limit: 'perPage',
//         page: 'currentPage',
//         nextPage: 'next',
//         prevPage: 'prev',
//         totalPages: 'pageCount',
//         pagingCounter: 'slNo',
//         meta: 'paginator',
//     };
//     const options = {
//         page: page || 1,
//         limit: limit || 10,
//         customLabels: myCustomLabels
//     };
    
//     let posts = await Post.paginate({}, options);
//     return res.json(posts);
// })