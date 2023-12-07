import { Request, Response } from "express";
import { UsersModel } from "../model";
import {
  getSingleUploadedMedia,
  uploadSingleMedia,
} from "../../util/helperFunctions";

class User {
  public getUser = async (req: Request, res: Response) => {
    const { userType, level } = req.params;
    try {
      let users: any[];

      if (userType === "staff") {
        users = await UsersModel.findAll({
          where: {
            userType,
          },
        });
      } else if (userType === "student") {
        users = await UsersModel.findAll({
          where: {
            userType,
            level,
          },
        });
      } else {
        users = await UsersModel.findAll();
      }

      if (users.length === 0) {
        return res.json({
          status: false,
          message: "No users found",
        });
      }

      const userData = [];
      for (const user of users) {
        const profileImg = await getSingleUploadedMedia(
          user.dataValues,
          "PROFILE_IMAGE",
        );
        const userDataItem = {
          ...user.dataValues,
          profileImg,
        };
        userData.push(userDataItem);
      }

      return res.json({
        status: true,
        message: `${users.length} users found`,
        data: userData,
      });
    } catch (err: any) {
      console.log(err, "error");
      return res.json({
        status: false,
        message: err.message || "Internal Server Error",
      });
    }
  };

  public uploadProfileImage = async (req: any, res: Response) => {
    try {
      const { user, link } = req.body;
      const mediaType = "PROFILE_IMAGE";
      const uploadImage = await uploadSingleMedia(user, mediaType, link);
      if (uploadImage?.success) {
        return res.json({
          status: true,
          message: mediaType + " uploaded",
        });
      } else {
        return res.json({
          status: false,
          message: mediaType + " upload failed " + uploadImage?.message,
        });
      }
    } catch (err) {
      return res.json({
        status: false,
        message: err,
      });
    }
  };
  public getSelf = async (req: any, res: Response) => {
    const { id } = req?.user;
    try {
      const userExists = await UsersModel.findOne({
        where: {
          id,
        },
      });
      if (userExists) {
        const profileImg = await getSingleUploadedMedia(
          userExists,
          "PROFILE_IMAGE",
        );
        return res.json({
          status: true,
          message: "user found",
          data: {
            ...userExists.dataValues,
            profileImg,
          },
        });
      } else {
        return res.json({
          status: false,
          message: "user not found",
        });
      }
    } catch (err) {
      return res.json({
        status: false,
        message: err,
      });
    }
  };
}

export const UserController = new User();
