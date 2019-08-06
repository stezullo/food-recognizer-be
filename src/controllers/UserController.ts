import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

export class UserController {

    static listAll = async (req: Request, res: Response) => {
        // Get users from db
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username", "role"]
        });

        // Send the users object
        res.send(users);
    }

    static getOneById = async (req: Request, res: Response) => {
        // Get the ID from the url
        const id: number = req.params.id;

        //Get the user from the database
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"]
            });
        }
        catch (error) {
            res.status(404).send("User not found");
        }
    }

    static newUser = async (req: Request, res: Response) => {
        let { username, password, role } = req.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        // Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Hash the passwords, to securely store on DB.
        user.hashPassword();

        // Try to save. If fails, the username is already used.
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        }
        catch (error) {
            // 409 - Conflict status code
            res.status(409).send("Username already in use");
            return;
        }

        // 201 - Created status. For new resources.
        res.status(201).send("User created");
    }

    static editUser = async (req: Request, res: Response) => {

        // Get the id from the url
        const id = req.params.id;

        // Get values from the body
        const { username, role } = req.body;

        // Try to find user on database
        let userRepository = getRepository(User);

        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        }
        catch (error) {
            res.status(404).send("User not found");
            return;
        }

        // Update the user
        user.username = username;
        user.role = role;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Try to save, if fails, username inserted has already been taken.
        try {
            await userRepository.save(user);
        }
        catch (error) {
            res.status(409).send("username already in use");
        }

        res.status(204).send();

    }

    static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        }
        catch (error) {
            res.status(404).send();
            return;
        }
        userRepository.delete(id);

        res.status(204).send();
    }


}

export default UserController;