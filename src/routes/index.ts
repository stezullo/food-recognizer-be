import { Router } from "express";
import auth from "./auth";
import user from "./user";
import recognition from "./recognition";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/recognition", recognition);

export default routes;