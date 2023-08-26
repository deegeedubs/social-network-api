const User = require('../models/User');

module.exports = {

  async createUser(req, res) {
    try {
      const userFriends = await User.findOne({ _id: req.params.userId }).friends;
      const friend = await User.findOne({ _id: req.params.friendId });

      console.log(userFriends);
        
      userFriends.push(friend._id);

      res.json(userFriends);

    } catch (err) {
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
  }

};
