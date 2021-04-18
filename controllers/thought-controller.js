const { Thought, User } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
            .then(dbThought => res.json(dbThought))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.ThoughtId })
            .populate({
                path: 'User',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThought => {
                if (!dbThought) {
                    res.status(404).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThought);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(dbThought => {
                User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThought._id } },
                    { new: true }
                )
                .then(dbUser => {
                    if (!dbUser) {
                        res.status(404).json({ message: 'No user found with this id' });
                        return;
                    }
                    res.json(dbUser);
                })
                .catch(err => res.json(err));
            })
            .catch(err => res.status(400).json(err));
        },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, 
            body, 
            { new: true, runValidators: true })
            .then(dbThought => {
                if (!dbThought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThought);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(dbThought => {
                User.findOneAndUpdate(
                    { username: dbThought.username },
                    { $pull: { thoughts: params.thoughtId } },
                    { new : true}
                )
                .then(() => {
                    res.json({message: 'Successfully deleted the thought'});
                })
                .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
    },

    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThought);
        })
        .catch(err => res.status(500).json(err));
    },
    

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: {_id: params.reactionId} } },
            { new: true, runValidators: true }
        )
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json({message: 'Successfully deleted the reaction'});
        })
        .catch(err => res.status(500).json(err));
    }
};


module.exports = thoughtController;
