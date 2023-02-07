const { PostCommentLike } = require("../models/models.wrapper");
const CmntGen = {};
/* Comment */

const generateMeta = async (uid, comments, meta) => {
    for (let i in comments) {
        let liked = await PostCommentLike.exists({
            comment: comments[i],
            user: uid,
        });
        meta.isLiked.push(liked ? true : false);
    }
};

CmntGen.generateMeta = generateMeta;

module.exports = CmntGen;
