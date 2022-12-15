const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    likers: {
      type: [String],
      required: true,
    },
    comments: {
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          time:{
            type:Date,default:new Date
          } ,
        }
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
 

const PostModel = model('post', PostSchema);
module.exports = PostModel;
