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
        Thought.findOne({ _id: params.id })
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
        Thought.findOneAndUpdate({ _id: params.id }, 
            body, 
            { new: true, runValidators: true })
            .then(dbThought => {
                if (!dbThought) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbThought);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThought => res.json(dbThought))
            .catch(err => res.json(err));
    },

    createReaction({ body }, res) {
        Thought.findOneAndUpdate(body)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    },

    deleteReaction({ params }, res) {
        Reaction.findOneAndDelete({ _id: params.id })
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    }
};


module.exports = thoughtController;
