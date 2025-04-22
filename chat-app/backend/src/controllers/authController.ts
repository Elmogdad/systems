import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../middlewares/errorHandler.js"
import { Request, Response } from "express"
import generateToken from "../utils/generateToken.js";

 const registerHander = async (req: Request, res: Response) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		if (!fullName || !username || !password || !confirmPassword || !gender) {
			return res.status(400).json({ error: "Please fill in all fields" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		const user = await prisma.user.findUnique({ where: { username } });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		// https://avatar-placeholder.iran.liara.run/
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = await prisma.user.create({
			data: {
				fullName,
				username,
				password: hashedPassword,
				gender,
				profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
			},
		});

		if (newUser) {
			// generate token in a sec
			generateToken(newUser.id, res);

			res.status(201).json({
                message: "User created successfully",
				id: newUser.id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error: any) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


 const loginHander  = async (req:Request, res:Response) => {
    try {
        const {username, password} = req.body
        if(!username || !password){
            return res.status(400).json({error: "Please fill in all fields"})
        }
        const user = await prisma.user.findUnique({where: {username}})
        if(!user){
            return res.status(400).json({error: "Invalid credentials"})
        }
        const isPasswordMatched = await bcryptjs.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(400).json({error: "Password is incorrect"})
        }
        // generate token in a sec
        generateToken(user.id, res);

        res.status(200).json({
            message : "Login successful",
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })

    } catch (error: any) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}
    

 const logoutHander  = async (req:Request, res:Response) => {
    try {

        res.cookie("jwt", "", {
            maxAge: 0});
        res.status(200).json({message: "Logout successful"})
    } catch (error) {
       res.status(500).json({message: "Internal server error"})
    }
}

const getMeHander = async (req:Request, res:Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })
        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}


export { registerHander, loginHander, logoutHander , getMeHander };
