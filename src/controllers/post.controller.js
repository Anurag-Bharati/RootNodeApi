const {
    Post,
    User,
    PostLike,
    PostComment,
    PostCommentLike,
    Connection,
} = require("../models/models.wrapper");

const {
    IllegalArgumentException,
    ResourceNotFoundException,
    InvalidMediaTypeException,
    IllegalPostTypeExecption,
} = require("../throwable/exception.rootnode");

const { isValidObjectId } = require("mongoose");
const { Sort } = require("../utils/algorithms");
const PostGen = require("../generator/post.gen");
const CmntGen = require("../generator/cmnt.gen");
const EntityFieldsFilter = require("../utils/entity.filter");
const ConsoleLog = require("../utils/log.console");
const HyperLinks = require("../utils/_link.hyper");
/* constraints start*/
const postPerPage = 5;
const commentsPerPage = 5;
const likerPerPage = 10;
/* constraints end*/

/* runtime store */
const userFeed = new Map();
/* runtime end */

const getAllPublicPost = async (req, res, next) => {
    const user = req.user;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const meta = {
        isLiked: [],
    };
    try {
        const [publicFeed, totalPosts] = await Promise.all([
            // execute query with page and limit values
            Post.find({ visibility: "public" })
                .populate("owner", EntityFieldsFilter.USER)
                .sort("-createdAt")
                .limit(postPerPage)
                .skip((page - 1) * postPerPage)
                .exec(),
            // get total documents in the Posts collection
            Post.countDocuments({ visibility: "public" }),
        ]);
        if (user?._id) await PostGen.generateMeta(user._id, publicFeed, meta);
        else meta.isLiked = new Array(totalPosts).fill(false);
        res.json({
            success: true,
            data: { feed: publicFeed, meta: meta },
            totalPages: Math.ceil(totalPosts / postPerPage),
            currentPage: Number(page),
            _links: {
                self: HyperLinks.postLinks,
                story: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};
const getPostByUser = async (req, res, next) => {
    const user = req.user;
    const id = req.params.id;

    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const meta = {
        isLiked: [],
    };

    try {
        if (!id) throw new IllegalArgumentException("Missing user id");
        all =
            user._id.equals(id) ||
            Connection.exists({ rootnode: user._id, node: id });
        const [posts, totalPosts] = await Promise.all([
            // execute query with page and limit values
            Post.find({
                visibility: all ? ["public", "mutual"] : "public",
                owner: id,
            })
                .populate("owner", EntityFieldsFilter.USER)
                .sort("-createdAt")
                .limit(postPerPage)
                .skip((page - 1) * postPerPage)
                .exec(),
            // get total documents in the Posts collection
            Post.countDocuments({
                visibility: all ? "public" : "public",
            }),
        ]);
        if (user?._id) await PostGen.generateMeta(user._id, posts, meta);
        else meta.isLiked = new Array(totalPosts).fill(false);
        res.json({
            success: true,
            data: { feed: posts, meta: meta },
            totalPages: Math.ceil(totalPosts / postPerPage),
            currentPage: Number(page),
            _links: {
                self: HyperLinks.postLinks,
                story: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getMyFeed = async (req, res, next) => {
    let { page, refresh } = req.query;
    const user = req.user;
    const uidStr = user._id.toString();
    page = page > 0 ? page : 1;
    refresh = refresh == 1 ? true : false;

    let feed = [];
    const conns = [];
    const meta = {
        isLiked: [],
    };

    try {
        if (refresh === true) userFeed.delete(uidStr);
        if (!userFeed.has(uidStr)) {
            ConsoleLog.genNewX("PostFeed", "feed", user.username);
            const myConns = await Connection.find({ rootnode: user._id });
            myConns.map((conn) => conns.push(conn.node));
            await PostGen.generateFeed(user._id, conns, feed);
            feed.sort(Sort.dynamicSort("-createdAt"));
            userFeed.set(uidStr, feed);
        } else {
            ConsoleLog.usingOldX("PostFeed", "feed", user.username);

            feed = userFeed.get(uidStr);
        }
        const paginatedFeed = feed.slice(
            (page - 1) * postPerPage,
            page * postPerPage
        );
        await PostGen.generateMeta(user._id, paginatedFeed, meta);
        const count = feed.length;

        res.json({
            success: true,
            data: { feed: paginatedFeed, meta: meta },
            totalPages: Math.ceil(count / postPerPage),
            currentPage: Number(page),
            _links: {
                self: HyperLinks.postLinks,
                story: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const getPostById = async (req, res, next) => {
    const pid = req.params.id;
    try {
        if (!pid) throw new IllegalArgumentException("Missing post id");
        if (!isValidObjectId(pid))
            throw new IllegalArgumentException("Invalid post id");
        const post = await Post.findById(pid).populate("owner");
        if (!post) throw new ResourceNotFoundException("Post not found");
        const liked = await PostLike.exists({ post: pid, user: req.user._id });
        res.json({
            success: true,
            data: { post: post, hasLiked: liked ? true : false },
            _links: { self: HyperLinks.postOpsLinks(pid) },
        });
    } catch (err) {
        next(err);
    }
};
const createPost = async (req, res, next) => {
    const {
        caption,
        visibility,
        isMarkdown,
        commentable,
        likeable,
        shareable,
    } = req.body;

    const mediaFiles = req.files;
    const hasMedia = mediaFiles?.length > 0;
    const medias = [];
    const uid = req.user._id;

    try {
        if (!caption && !hasMedia)
            throw new IllegalArgumentException("Invalid Post parameters");

        if (isMarkdown === "true" && hasMedia) {
            throw new IllegalPostTypeExecption(
                "Markdown cannot contain media files"
            );
        }
        if (hasMedia) {
            mediaFiles.forEach((media) => {
                if (!media.path)
                    throw new ResourceNotFoundException("Media url not found");
                if (!media.mimetype)
                    throw new InvalidMediaTypeException(
                        "Media type not specified"
                    );
                medias.push({
                    url: media.path,
                    type: media.mimetype.split("/")[0],
                });
            });
        }
        let type;
        if (isMarkdown == "true") type = "markdown";
        else if (hasMedia && caption) type = "mixed";
        else if (hasMedia && !caption) type = "media";
        else type = "text";
        // Independent Operations: Post Creation and Find User
        const postPromise = Post.create({
            type: type,
            owner: uid,
            caption: caption,
            mediaFiles: medias,
            visibility: visibility,
            isMarkdown: isMarkdown,
            commentable: commentable,
            likeable: likeable,
            shareable: shareable,
        });

        const userPromise = User.findById(uid).select("_id postsCount");

        // concurrency
        const [post, user] = await Promise.all([postPromise, userPromise]);

        // increase user post count
        user.postsCount++;
        await user.save();

        // send feedback
        res.status(201).json({
            success: true,
            message: "Post created successfully!",
            data: post,
            _links: { self: HyperLinks.postOpsLinks(post._id) },
        });
    } catch (err) {
        next(err);
    }
};

const likeUnlikePost = async (req, res, next) => {
    const pid = req.params.id;
    const uid = req.user._id;
    try {
        if (!pid) throw new IllegalArgumentException("Invalid/Missing Post Id");
        const post = await Post.findById(pid).select(["_id", "likesCount"]);
        if (!post) throw new ResourceNotFoundException("Post not found");
        const isLiked = await PostLike.findOne({ post: pid, user: uid });
        if (isLiked) {
            post.likesCount--;

            // concurrency
            await Promise.all([
                PostLike.findOneAndDelete({
                    post: post._id,
                    user: uid,
                }),
                post.save(),
            ]);

            res.json({
                success: true,
                reply: "Post unliked successfully!",
                data: { liked: false },
            });
        } else {
            post.likesCount++;
            await Promise.all([
                PostLike.create({ post: post._id, user: uid }),
                post.save(),
            ]);
            res.json({
                success: true,
                message: "Post liked successfully!",
                data: { liked: true },
                _links: { self: HyperLinks.postOpsLinks(pid) },
            });
        }
    } catch (err) {
        next(err);
    }
};

const getPostLiker = async (req, res, next) => {
    const pid = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        if (!pid) throw new IllegalArgumentException("Invalid/Missing Post Id");
        if (!isValidObjectId(pid))
            throw new IllegalArgumentException("Invalid Post Id");
        // check if post exists
        const post = await Post.exists({ _id: pid });
        if (!post) throw new ResourceNotFoundException("Post not found");

        const likerPromise = PostLike.find({ post: pid })
            .populate("user", ["username", "showOnlineStatus", "avatar"])
            .sort("-createdAt")
            .limit(likerPerPage)
            .skip((page - 1) * likerPerPage)
            .exec();

        const countPromise = PostLike.find({ post: pid }).countDocuments();
        const [likers, count] = await Promise.all([likerPromise, countPromise]);

        res.json({
            success: true,
            data: likers,
            totalPages: Math.ceil(count / likerPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.postOpsLinks(pid) },
        });
    } catch (err) {
        next(err);
    }
};

const getPostCommentLiker = async (req, res, next) => {
    const cid = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    try {
        if (!cid) throw new IllegalArgumentException("Missing Comment Id");
        if (!isValidObjectId(cid))
            throw new IllegalArgumentException("Invalid Comment Id");
        const comment = await PostComment.exists({ _id: cid });
        if (!comment) throw new ResourceNotFoundException("Comment not found");

        const likerPromise = PostCommentLike.find({ comment: cid })
            .populate("user", ["username", "showOnlineStatus", "avatar"])
            .sort("-createdAt")
            .limit(likerPerPage)
            .skip((page - 1) * likerPerPage)
            .exec();

        const countPromise = PostCommentLike.find({
            comment: cid,
        }).countDocuments();

        const [likers, count] = await Promise.all([likerPromise, countPromise]);

        res.json({
            success: true,
            data: likers,
            totalPages: Math.ceil(count / likerPerPage),
            currentPage: Number(page),
            _links: { self: HyperLinks.commentOpsLinks(cid) },
        });
    } catch (err) {
        next(err);
    }
};

const addComment = async (req, res, next) => {
    const pid = req.params.id;
    const cmt = req.body.comment;
    console.log(req.body);
    try {
        if (!pid) throw new IllegalArgumentException("Missing post Id");
        if (!cmt) throw new IllegalArgumentException("Missing comment field");

        const validID = isValidObjectId(pid);
        if (!validID) throw new IllegalArgumentException("Invalid post Id");

        const post = await Post.findById(pid).select(["_id", "commentsCount"]);
        if (!post) throw new ResourceNotFoundException("Post not found");

        post.commentsCount++;

        const [newComment, updatedPost] = await Promise.all([
            PostComment.create({
                post: post._id,
                user: req.user._id,
                comment: cmt,
            }),
            post.save(),
        ]);

        const processedComment = await newComment.populate(
            "user",
            EntityFieldsFilter.USER
        );

        res.status(201).json({
            success: true,
            message: "Comment posted!",
            data: processedComment,
            _links: {
                self: HyperLinks.commentOpsLinks(newComment._id),
                post: HyperLinks.postOpsLinks(pid),
            },
        });
    } catch (err) {
        next(err);
    }
};

const getCommentByID = async (req, res, next) => {
    const cid = req.params.id;
    try {
        if (!cid) throw new IllegalArgumentException("Missing comment id");
        const validId = isValidObjectId(cid);
        if (!validId) throw new IllegalArgumentException("Invalid Comment Id");
        const comment = await PostComment.findById(cid);
        if (!comment) throw new ResourceNotFoundException("Comment not found");
        res.status(200).json({
            success: true,
            data: comment,
            _links: { self: HyperLinks.commentOpsLinks(cid) },
        });
    } catch (err) {
        next(err);
    }
};

const updateCommentByID = async (req, res, next) => {
    const cid = req.params.id;
    try {
        if (!cid) throw new IllegalArgumentException("Missing Comment Id");
        const validId = isValidObjectId(cid);
        if (!validId) throw new IllegalArgumentException("Invalid Comment Id");
        const comment = await PostComment.findById(cid);
        // TODO check owner
        if (!comment) throw new ResourceNotFoundException("Comment not found");
        const updatedComment = await PostComment.findByIdAndUpdate(
            cid,
            { $set: req.body },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedComment,
            _links: { self: HyperLinks.commentOpsLinks(cid) },
        });
    } catch (err) {
        next(err);
    }
};

const deleteCommentById = async (req, res, next) => {
    const cid = req.params.id;
    try {
        if (!cid) throw new IllegalArgumentException("Missing Comment Id");
        const validId = isValidObjectId(cid);
        if (!validId) throw new IllegalArgumentException("Invalid Comment Id");
        // TODO check owner
        const result = await PostComment.findByIdAndDelete(cid);
        if (!result) throw new ResourceNotFoundException("Comment not found");
        const post = await Post.findById(result.post);
        post.commentsCount > 0 ? post.commentsCount-- : null;
        await post.save();
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const getComments = async (req, res, next) => {
    const user = req.user;
    const pid = req.params.id;
    let page = req.query.page || 1;
    page = page > 0 ? page : 1;
    const meta = {
        isLiked: [],
    };
    try {
        if (!pid) throw new IllegalArgumentException("Missing Post Id");
        const validId = isValidObjectId(pid);
        if (!validId) throw new IllegalArgumentException("Invalid Post Id");
        const commentsPromise = PostComment.find({ post: pid })
            .sort("-createdAt")
            .select("-post -__v")
            .populate("user", EntityFieldsFilter.USER)
            .limit(commentsPerPage)
            .skip((page - 1) * commentsPerPage)
            .exec();

        const countPromise = PostComment.countDocuments({ post: pid });
        const [comments, count] = await Promise.all([
            commentsPromise,
            countPromise,
        ]);
        if (user?._id) await CmntGen.generateMeta(user._id, comments, meta);
        else meta.isLiked = new Array(count).fill(false);
        res.json({
            success: true,
            data: { comments: comments, meta: meta },
            totalPages: Math.ceil(count / commentsPerPage),
            currentPage: Number(page),
            _links: { post: HyperLinks.postOpsLinks(pid) },
        });
    } catch (err) {
        next(err);
    }
};

const likeUnlikeComment = async (req, res, next) => {
    const cid = req.params.id;
    const uid = req.user._id;
    try {
        if (!cid) throw new IllegalArgumentException("Missing Comment Id");
        const validId = isValidObjectId(cid);
        if (!validId) throw new IllegalArgumentException("Invalid Comment Id");
        const comment = await PostComment.findById(cid).select([
            "_id",
            "likesCount",
        ]);
        if (!comment) throw new ResourceNotFoundException("Comment not found");
        const isLiked = await PostCommentLike.findOne({
            comment: comment._id,
            user: uid,
        });
        if (isLiked) {
            comment.likesCount--;
            await Promise.all([
                PostCommentLike.findOneAndDelete({
                    comment: comment._id,
                    user: uid,
                }),
                comment.save(),
            ]);
            res.status(200).json({
                success: true,
                message: "Comment unliked successfully!",
                data: { liked: false },
            });
        } else {
            comment.likesCount++;
            await Promise.all([
                PostCommentLike.create({
                    comment: comment._id,
                    user: uid,
                }),
                comment.save(),
            ]);
            res.json({
                success: true,
                message: "Comment liked successfully!",
                data: { liked: true },
                _links: { self: HyperLinks.commentOpsLinks(cid) },
            });
        }
    } catch (err) {
        next(err);
    }
};

const updatePostById = async (req, res, next) => {
    const pid = req.params.id;
    const mediaFiles = req.files;
    const isMarkdown = req.body.isMarkdown;
    try {
        if (!pid) throw new IllegalArgumentException("Missing Post Id");
        const validId = isValidObjectId(pid);
        if (!validId) throw new IllegalArgumentException("Invalid Post Id");
        const post = await Post.findById(pid);
        // TODO Check owner
        const hasMedia = mediaFiles?.length > 0;
        if (!post) throw new ResourceNotFoundException("Post not found");
        const type = post.type;
        if ((type === "markdown" && hasMedia) || (isMarkdown && hasMedia))
            throw new IllegalPostTypeExecption(
                "Markdown cannot have media files"
            );

        // #BUG FIX_THIS: Add photo overwrite previous
        // Possible soln: Send unselected MediaID in seperate field -
        // or vice-versa. Then Append link to newMedia[].
        if (hasMedia) {
            const newMedias = [];
            mediaFiles.forEach((media) => {
                if (!media.path)
                    throw new ResourceNotFoundException("Media url not found");
                if (!media.mimetype)
                    throw new InvalidMediaTypeException(
                        "Media type not specified"
                    );
                newMedias.push({
                    url: media.path,
                    type: media.mimetype.split("/")[0],
                });
            });
            // Add field to body
            req.body.mediaFiles = newMedias;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            pid,
            { $set: req.body },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedPost,
            _links: { self: HyperLinks.postOpsLinks(pid) },
        });
    } catch (err) {
        next(err);
    }
};

const deletePostById = async (req, res, next) => {
    const pid = req.params.id;
    try {
        if (!pid) throw new IllegalArgumentException("Missing Post Id");
        const validId = isValidObjectId(pid);
        if (!validId) throw new IllegalArgumentException("Invalid Post Id");
        // TODO Check owner
        const result = await Post.findByIdAndDelete(pid);
        if (!result) throw new ResourceNotFoundException("Post not found");
        const owner = await User.findById(result.owner._id);
        if (owner) owner.postsCount > 0 ? owner.postsCount-- : null;
        await owner?.save();
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const deleteAllPost = async (req, res, next) => {
    const [likes, clikes, cmts, posts] = await Promise.all([
        PostLike.find(),
        PostCommentLike.find(),
        PostComment.find(),
        Post.find(),
    ]);

    likes.forEach(async (pl) => pl.remove());
    clikes.forEach(async (cl) => cl.remove());
    cmts.forEach(async (c) => c.remove());
    posts.forEach(async (p) => p.remove());
    res.json({ success: true, message: "All post cleared!" });
};

module.exports = {
    getAllPublicPost,
    getMyFeed,
    getPostById,
    getPostByUser,
    createPost,
    updatePostById,
    deletePostById,
    deleteAllPost,
    likeUnlikePost,
    getPostLiker,
    getComments,
    addComment,
    likeUnlikeComment,
    getPostCommentLiker,
    updateCommentByID,
    deleteCommentById,
    getCommentByID,
};
