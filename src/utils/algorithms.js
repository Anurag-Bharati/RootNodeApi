const Algorithms = {};
const PostAlgo = {};

/* POST  */

/* Durstenfeld shuffle algorithm */
const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

PostAlgo.shuffle = shuffle;
Algorithms.PostAlgo = PostAlgo;
module.exports = Algorithms;
