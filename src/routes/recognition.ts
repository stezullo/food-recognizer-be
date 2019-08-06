import { Router } from "express";
//import { checkJwt } from "../middlewares/checkJwt";
//import { checkRole } from "../middlewares/checkRole";
import { RecognitionController } from "../controllers/RecognitionController";

const router = Router();

//Recognition Route
//router.post("/", [checkJwt, checkRole(["ADMIN"])], RecognitionController.recognition); TODO Auth will be enabled afterwards.
router.post("/", RecognitionController.recognition);

export default router;