import vision = require('@google-cloud/vision');

import { Request, Response } from "express";

export class RecognitionController {
    static recognition = async (req: Request, res: Response) => {

        let recognitionResult: any;
        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Performs label detection on the image file
        const [result] = await client.labelDetection("./src/resources/pizza.jpg");
        const labels = result.labelAnnotations;

        res.status(200).send(labels);
    }
}

export default RecognitionController;