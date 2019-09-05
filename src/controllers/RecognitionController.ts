import { Request, Response } from "express";

import vision = require('@google-cloud/vision');

export class RecognitionController {
    static recognition = async (req: Request, res: Response) => {
        let currentPath = process.cwd();
        console.log("Current directory");
        console.log(currentPath);
        let file = req.file;

        if (!file) {
            // Bad request
            res.status(400).send();
            return;
        }

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Create a buffer
        let fileBuffer: Buffer = <Buffer>file.buffer;

        // Performs label detection on the image file
        const [result] = await client.labelDetection(fileBuffer);
        const recognitionResult = result.labelAnnotations;

        res.status(200).send(recognitionResult);
    }
}

export default RecognitionController;