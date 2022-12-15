const UserModel = require("../models/user.model");

const cloudinary = require("../utils/Cloudinary");
const { uploadErrors } = require("../utils/errors.utils");


module.exports.imageProfil = async (req, res) => {

  let { picture, id } = req.body;
  console.log(req.body,'body')
  try {
    const img = await cloudinary.uploader.upload(picture);
    console.log(img, "cloudinary response");
    let userUpdated = await UserModel.findOneAndUpdate(
      { _id: id },
      { picture: img.secure_url },
      { new: true });
    res.send(userUpdated)
  }catch (err) {
    const errors = uploadErrors (err);
    res.status(200).json({errors});
    console.log(err)
};  
}