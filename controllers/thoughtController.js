const User = require('../models/User');
const Thought = require('../models/Thought');
const Reaction = require('../models/Reaction');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json(thought);
        } catch (err) {
        res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { username: req.body.username },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
            message: 'Thought created, but found no user with that ID',
            });
        }

        res.json(thought);
        } catch (err) {
        res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            {$set: req.body}, 
            {new: true}
        );
        res.json(thought);

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        } catch(err) {
        res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
        const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        res.json({message: 'Thought deleted.'});
        } catch(err) {
        res.status(500).json(err);
        }
    },

    async getReactions(req, res) {
        try {
            const reactions = await Reaction.find();
            res.json(reactions);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createReaction(req,res) {
        try {
            const reaction = await Reaction.create(req.body);
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId}, 
                {$addToSet: {reactions: reaction.reactionId}},
                {new: true}
                );

            console.log(thought);
    
            res.json(reaction);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const reaction = await Reaction.findOneAndRemove({ reactionId: req.params.reactionId });
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: req.params.reactionId}},
                {new: true}
            )
            if(!reaction) {
                return res.status(404).json({message: 'No reaction found'});
            }
            if (!thought) {
                return res.json({ message: 'Reaction not associated with a thought' });
            }
            res.json({message: 'Reaction deleted.'});
            } catch(err) {
            res.status(500).json(err);
            }
    }

};
