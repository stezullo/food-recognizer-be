import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
    static login = async (req: Request, res: Response) => {
        // Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            // Bad request
            res.status(400).send();
            return;
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail({ where: { username } })
        }
        catch (error) {
            res.status(401).send();
            return;
        }

        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "24h" }
        );

        // Send the jwt in the response
        res.send(token);
    }

    static changePassword = async (req: Request, res: Response) => {
        // Get id from JWT
        let id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
            return;
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        }
        catch (error) {
            res.status(401).send();
            return;
        }

        // if the old password doesn't match
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        // Validation new password (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        // Hash the new password and save into db
        user.hashPassword();
        userRepository.save(user);

        // 204 - Updates with no changes in webpage
        res.status(204).send();
    };
}

export default AuthController;