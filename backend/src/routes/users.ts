import { Router } from "express";
import { registerUser } from "../handlers/users.js";
import { upload } from "../middlewares/multer.js";
// import { editUserById, getUsers } from "../handlers/users.js";
// const router = Router();

// // router.get("/", getUsers);
// // router.put("/:id", editUserById);
// export default router;
const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
export default router;
