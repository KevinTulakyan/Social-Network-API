const { User } = require('../models');

const userController = {
  getAllUser(req, res) {
    User.find({})
      .sort({ _id: -1 })
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'Thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUser => res.json(dbUser))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.json(err));
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUser => {
        if (!dbUser) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUser);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.json(err));
  }
};

module.exports = userController;