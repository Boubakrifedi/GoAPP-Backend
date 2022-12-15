const UserModel = require("../models/user.model");
const {updateErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};

module.exports.updateUserInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  const user = await UserModel.findById(req.params.id);
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio || user.bio,
          pseudo: req.body.pseudo || user.pseudo,
          email: req.body.email || user.email,
        },
      },
      { new: true, upsert: true, runValidators: true })
      .then((data) => res.send(data));
  } catch (err) {
    const errors = updateErrors(err);
    res.status(200).json({ errors });
  }
};
// module.exports.updateUserPseudo = async (req, res) => {
//   if (!ObjectID.isValid(req.params.id))
//     return res.status(400).send("ID unknown : " + req.params.id);

//   try {
//     await UserModel.findOneAndUpdate(
//       { _id: req.params.id },
//       {
//         $set: {
//           pseudo: req.body.pseudo,
//         },
//       },
//       { runValidators: true },)
//       .then((data) => res.send(data),)
//   } catch (err) {
//     const errors = updateErrors(err);
//     res.status(200).json({ errors });
//   }
// };
// module.exports.updateUserEmail = async (req, res) => {

//   if (!ObjectID.isValid(req.params.id))
//     return res.status(400).send("ID unknown : " + req.params.id);

//   try {
//     await UserModel.findOneAndUpdate(
//       { _id: req.params.id },

//       {
//         $set: {
//           email: req.body.email,
//         },
//       },
//       { runValidators: true },)
//       .then((data) => res.send(data),)
//   } catch (err) {
//     const errors = updateErrors(err);
//     res.status(200).json({ errors });
//   }
// };

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  // let u = await UserModel.findOne({ _id: req.params.id })

  // u.following.push(req.body.idToFollow)
  // await UserModel.findOneAndUpdate({ _id: req.params.id }, { following: u.following }, { new: true })

  // let u2 = await UserModel.findOne({ _id: req.body.idToFollow })
  // u2.followers.push(req.params.id)
  // await UserModel.findOneAndUpdate({ _id: req.body.idToFollow }, { followers: u2.followers }, { new: true })

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToFollow))
    return res
      .status(400)
      .send("ID to follow unknown : " + req.body.idToFollow);

  if (req.params.id == req.body.idToFollow)
    return res.status(400).send("you cant follow yourself !!!");

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToUnfollow))
    return res
      .status(400)
      .send("ID to unfollow unknown : " + req.body.idToUnfollow);

  if (req.params.id == req.body.idToUnfollow)
    return res.status(400).send("you cant unfollow yourself !!!");

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    ),
      // Retirer de la liste des followers
      await UserModel.findByIdAndUpdate(
        req.body.idToUnfollow,
        { $pull: { followers: req.params.id } },
        { new: true, upsert: true },
        (err, docs) => {
          // if (!err) res.status(201).json(docs);
          if (err) res.status(400).json(err);
        }
      );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.remove = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID user unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToRemove))
    return res
      .status(400)
      .send("ID to romove unknown : " + req.body.idToRemove);

  if (req.params.id == req.body.idToRemove)
    return res.status(400).send("you cant remove yourself !!!");

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.body.idToRemove } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    ),
      await UserModel.findByIdAndUpdate(
        req.body.idToRemove,
        { $pull: { following: req.params.id } },
        { new: true, upsert: true },
        (err, docs) => {
          // if (!err) res.status(201).json(docs);
          if (err) res.status(400).json(err);
        }
      );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
