import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as multer from "multer";

import routes from "./routes";

createConnection()
    .then(async connection => {
        // create express app
        const app = express();
        const SERVER_PORT = 3000;

        // Middlewares
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(multer().single("file"));

        // Main route
        app.use("/", routes);


        // start express server
        app.listen(SERVER_PORT, () => {
            console.log(`Food Recognizer's server has started on port ${SERVER_PORT}!`);
        });

    }).catch(error => console.log(error));
