const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            require: true,
            maxLength: 280
        },
        userName:{
            type: String,
            required: true
        },
        toJSON: {
            getters: true
        }
    }
);


const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        userName:{
            type: String,
            required: true
        },
        reatctions:[ReactionSchema],
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

ThoughtSchema.virtual('friendCount').get(function() {
    return this.reactions.length
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;