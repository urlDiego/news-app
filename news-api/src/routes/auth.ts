import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

interface AuthBody {
    email?: string;
    password?: string;
}

const authenticate = async (request: any, reply: any) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: 'Unauthorized: Invalid or missing token' });
    }
};


export async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/register", async (request, reply) => {
        try {
            const { email, password } = request.body as AuthBody;

            if (!email || !password || password.trim().length < 6) {
                return reply.status(400).send({
                    error: "Email and password (minimum 6 characters) are required",
                });
            }


            const normalizedEmail = email.toLowerCase().trim();

            const [existingUser] = await db
                .select()
                .from(users)
                .where(eq(users.email, normalizedEmail))
                .limit(1);

            if (existingUser) {
                return reply.status(409).send({ error: "Email already registered" });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const [newUser] = await db
                .insert(users)
                .values({
                    email: normalizedEmail,
                    password_hash: passwordHash,
                })
                .returning({
                    id: users.id,
                    email: users.email,
                });

            return reply.status(201).send(newUser);
        } catch (err) {
            request.log.error(err);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    fastify.post("/login", async (request, reply) => {
        try {
            const { email, password } = request.body as AuthBody;

            if (!email || !password) {
                return reply.status(400).send({
                    error: "Email and password are required",
                });
            }

            const normalizedEmail = email.toLowerCase().trim();

            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, normalizedEmail))
                .limit(1);

            if (!user) {
                return reply.status(401).send({ error: "Invalid email or password" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash);

            if (!isValidPassword) {
                return reply.status(401).send({ error: "Invalid email or password" });
            }

            const token = fastify.jwt.sign(
                { id: user.id, email: user.email },
                { expiresIn: "7d" }
            );

            return reply.send({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
        } catch (err) {
            request.log.error(err);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
    fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
        return { user: request.user };
    });
}
