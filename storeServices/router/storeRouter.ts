import { Router } from "express";
import { createProduct, viewAllProduct, viewOneProduct } from "../controller/storeController";
import { verified } from "../utils/verify";

const router = Router();

router.route("/create-product").post(verified,createProduct)
router.route("/view-all-product").get(viewAllProduct)
router.route("/view-one-product").get(viewOneProduct)

export default router