import { Router } from "express";
import { editUserById, getUsers } from "../handlers/users.js";
const router = Router();

router.get("/", getUsers);
router.put("/:id", editUserById);
export default router;
