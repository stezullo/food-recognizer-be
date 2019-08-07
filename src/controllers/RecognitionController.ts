import vision = require('@google-cloud/vision');

import { Request, Response } from "express";

export class RecognitionController {
    static recognition = async (req: Request, res: Response) => {

        let { photo } = req.body;

        if (!photo) {
            // Bad request
            res.status(400).send();
            return;
        }

        let photoBuffer: Buffer = Buffer.from(photo);

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Performs label detection on the image file
        const [result] = await client.labelDetection(photoBuffer);
        const recognitionResult = result.labelAnnotations;

        res.status(200).send(recognitionResult);
    }
}

export default RecognitionController;