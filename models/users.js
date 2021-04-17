const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
    {
      userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
      },
      thoughts:[
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought'
        }
      ],
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      // prevents virtuals from creating duplicate of _id as `id`
      id: false
    }
  );

  PizzaSchema.virtual('friendCount').get(function() {
    return this.friends.length
  });

module.exports = User;