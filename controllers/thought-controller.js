const { Thought } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
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
            .then(dbUser => res.json(dbUser))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUser => {
                if (!dbUser) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUser);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    },

    createReaction({ body }, res) {
        Reaction.create(body)
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
