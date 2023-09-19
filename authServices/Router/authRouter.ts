import { Router } from "express";
import {
  createUser,
  deleteUser,
  getOneUser,
  signInUser,
  updateAccountAvatar,
  veiwAllUser,
  verifyUser,
} from "../controller/authController";
import validatorHolder from "../utils/validatorHolder";
import { createAccount, signInAccount } from "../utils/validation";
import upload from "../utils/multer";

const router = Router();

router.route("/get-all").get(veiwAllUser);
router.route("/register").post(validatorHolder(createAccount), createUser);
router.route("/sign-in").post(validatorHolder(signInAccount), signInUser);
router.route("/:userID/verified").get(verifyUser);
router.route("/:userID/delete-account").delete(deleteUser);
router.route("/:userID/get-one").get(getOneUser);
router
  .route("/:userId/update-acccount-avatar")
  .patch(upload, updateAccountAvatar);

export default router;


