// import { Request, Response } from "express";

// export function getUsers(
//   request: Request,
//   response: Response<{ id: string; name: string }>
// ) {
//   response.status(200).send({ id: "1", name: "Dipesh" });
// }

// export function getUsersById(request: Request, response: Response) {
//   response.send([]);
// }
// export async function createUser(request: Request<{}>, response: Response) {
//   response.send([]);
// }

// export function editUserById(
//   request: Request<
//     { id: string },
//     { id: string; success: boolean },
//     // dont know about this second paramater
//     { title?: string; description?: string },
//     { return: boolean }
//   >,
//   response: Response<{ id: string; success: boolean }>
// ) {
//   const userID = request.params.id;
//   const data = request.body;
//   //   const { description, title } = data;
//   const shouldReturn = request.query.return;
//   (console.log(data, userID, shouldReturn), "logs");
//   response.send({ id: "1", success: true });
// }

/// request : Request < ParamsObjectType , ResponseBodyType, ReuqestBodyType, QueryParamsType>
// eg. params : {id: string, organizationId: string}
// eg. ResponseBody : {users : User[]}
// e.g. RequestBody : {email:string,password:string}
// e.g. QueryParms : {limit:10,page:2}
import { existsSync, unlinkSync } from "node:fs";
import { UserModal } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createUserSchema, loginUserSchema } from "../validators/users.js";
import { uploadToCloudinary } from "../services/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcryptjs";
type UploadedFile = {
  filename?: string;
  path?: string;
};

type UploadedFiles = {
  avatar?: UploadedFile[];
  coverImage?: UploadedFile[];
};
const unlinkImage = (path: string) => {
  unlinkSync(path);
};
export const geneerateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await UserModal.findById(userId);
    if (!user) {
      throw new ApiErrors(500, "Errror fetching user");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new ApiErrors(500, "Internal server error");
  }
};
export const registerUser = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
  const body = req.body;
  console.log(body, "body");
  const files: UploadedFiles | undefined = req.files as
    | UploadedFiles
    | undefined;
  const avatar = files?.avatar?.[0]?.path;
  const coverImage = files?.coverImage?.[0]?.path;
  if (!avatar) {
    throw new ApiErrors(400, "Avatar is required");
  }
  const { success, data, error } = createUserSchema.safeParse(body);
  if (!success) {
    unlinkSync(avatar);
    if (coverImage) {
      unlinkSync(coverImage);
    }
    throw new ApiErrors(400, error.message);
  }
  const { email, fullName, password, username } = data;
  // shit syntax
  const existingUser = await UserModal.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    console.log(existingUser, "existing user");
    throw new ApiErrors(409, "User already exists");
  }

  console.log(files, "files");

  const avatarExists = existsSync(avatar);
  if (!avatarExists) {
    throw new ApiErrors(400, "Avatar file does not exist");
  }
  let avatarUrl = "";
  let coverImageUrl = "";
  const avatarUploadPromise = uploadToCloudinary(avatar);
  if (coverImage) {
    const coverImageExists = existsSync(coverImage);

    if (coverImageExists) {
      const coverImageUploadPromise = uploadToCloudinary(coverImage);
      const [avatarRes, coverImageRes] = await Promise.all([
        avatarUploadPromise,
        coverImageUploadPromise,
      ]);
      console.log(avatarRes, coverImageRes, "image upload res");
      avatarUrl = avatarRes?.url || "";
      coverImageUrl = coverImageRes?.url || "";
    }
  } else {
    const avatarRes = await avatarUploadPromise;
    avatarUrl = avatarRes?.url || "";
  }
  if (!avatarUrl) {
    unlinkSync(avatar);
    if (coverImage) {
      unlinkSync(coverImage);
    }
    throw new ApiErrors(500, "Error uploading avatar");
  }

  const createUserRes = await UserModal.create({
    fullName,
    username,
    email,
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });
  const createdUser = await UserModal.findById(createUserRes._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    unlinkSync(avatar);
    if (coverImage) {
      unlinkSync(coverImage);
    }
    throw new ApiErrors(500, "Error creating user");
  }
  const response = new ApiResponse(201, true, "User created", createdUser);
  res.status(201).json(response);

  // const coverImage = files?.find(file => file.f)
});

export const loginUser = asyncHandler(async (req, res) => {
  const body = req.body;
  const { success, data, error } = loginUserSchema.safeParse(body);
  if (!success) {
    throw new ApiErrors(400, error.message);
  }
  const { email, password, username } = data;
  // OR operator is very good if you think about it
  const user = await UserModal.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiErrors(400, "No user exists with provided  ");
  }
  const isValidPassword = await user.isPasswordMatched(password);
  if (!isValidPassword) {
    throw new ApiErrors(401, "Invalid Credentials");
  }
  // refresh token generate gareara pathauni
});
