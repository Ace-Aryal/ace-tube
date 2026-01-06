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
import { existsSync } from "node:fs";
import { UserModal } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createUserSchema } from "../validators/users.js";
import { uploadToCloudinary } from "../services/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
type UploadedFile = {
  filename?: string;
  path?: string;
};

type UploadedFiles = {
  avatar?: UploadedFile[];
  coverImage?: UploadedFile[];
};

export const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  const { success, data, error } = createUserSchema.safeParse(body);
  if (!success) {
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
  const files: UploadedFiles | undefined = req.files as
    | UploadedFiles
    | undefined;
  console.log(files, "files");
  const avatar = files?.avatar?.[0]?.path;
  const coverImage = files?.coverImage?.[0]?.path;
  if (!avatar) {
    throw new ApiErrors(400, "Avatar is required");
  }
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
      avatarUrl = avatarRes?.url || "";
      coverImageUrl = coverImageRes?.url || "";
    }
  } else {
    const avatarRes = await avatarUploadPromise;
    avatarUrl = avatarRes?.url || "";
  }
  const createUserRes = await UserModal.create({
    fullName,
    username,
    email,
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });
  const createdUser = await UserModal.findById(createUserRes._id);
  if (!createdUser) {
    throw new ApiErrors(500, "Error creating user");
  }
  const response = new ApiResponse(201, true, "User created", createdUser);
  res.status(201).json(response);
  // const coverImage = files?.find(file => file.f)
});
