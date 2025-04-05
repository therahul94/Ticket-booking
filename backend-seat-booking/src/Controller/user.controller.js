import bcrypt from "bcryptjs";
import { prisma } from "../client.js";
import jwt from "jsonwebtoken";
import { signinValidation, signupValidation } from "../sanitize.js";

export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const validatedObj = signupValidation(req.body);
        if(validatedObj.status === 'error') return res.status(400).json({code: 'validation-error', error: validatedObj.message});
        const isEmailAvail = await prisma.user.findUnique({
            where: {
                email
            }
        });
        
        if(isEmailAvail) {
            return res.status(401).json({error: "Already have an account with the provided email!"})
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: encryptedPassword
            }
        });
        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        console.error('Error registering user:', error);
        await prisma.$disconnect();
        return res.status(500).json({ error: 'Failed to register user' });
    }
}

export async function loginUser(req, res) {
    // const prisma = new PrismaClient({
    //     datasourceUrl: process.env.DATABASE_URL,
    // }).$extends(withAccelerate())
    try {
        const { email, password } = req.body;
        const validatedObj = signinValidation(req.body);
        if(validatedObj.status === 'error') return res.status(400).json({code: 'validation-error', error: validatedObj.message});
  
        const isUserAvail = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!isUserAvail) {
            return res.status(400).json({ error: "New user! Please register." });
        }
        const isValidPassword = await bcrypt.compare(password, isUserAvail.password);
        if (!isValidPassword) return res.status(401).json({ error: "Invalid email or password" });

        // Generate JWT token
        const token = jwt.sign(
            { id: isUserAvail.id, email: isUserAvail.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: isUserAvail.id,
                name: isUserAvail.name,
                email: isUserAvail.email
            },
            token
        });


    } catch (error) {
        console.log(error);
        await prisma.$disconnect();
        return res.status(400).json({ error: 'Failed to login!' });
    }
}