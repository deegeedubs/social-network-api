const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      console.log(req.body);
      const user = await User.findOneAndUpdate({ _id: req.params.userId }, {$set: req.body}, {new: true});

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);

    } catch(err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      const thoughts = await Thought.deleteMany({username: req.params.username});

      if(!thoughts){
        return res
          .status(200)
          .json({ message: 'User deleted.' });
      }

      res.json({message: 'User and all associated thoughts deleted.'});
    } catch(err) {
      res.status(500).json(err);
    }
  },

  async getFriends(req, res) {
    try {
      const user = await User.findOne({_id: req.params.userId});

      res.json(user.friends);


    } catch(err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const user1 = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      const user2 = await User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $addToSet: { friends: req.params.userId } },
        { new: true }
      );

      if (!user1 || !user2) {
        return res.status(404).json({message: "User not found!"})
      }

      res.json({user1, user2});

    } catch(err) {
      res.status(500).json(err);
    }
  },

  async removeFriend(req, res) {
    try {
      const user1 = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      const user2 = await User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $pull: { friends: req.params.userId } },
        { new: true }
      );

      if (!user1 || !user2) {
        return res.status(404).json({message: "User not found!"})
      }

      res.json({user1, user2});

    } catch(err) {
      res.status(500).json(err);
    }
  },

};
