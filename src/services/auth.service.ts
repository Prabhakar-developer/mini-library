import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser, roles } from '../models/user.model';
import { config } from '../config/config';

export class AuthService {
    /**
     * Registers a new user in the system.
     * @param email - User's email.
     * @param password - User's password.
     * @param role - User's role.
     * @returns Created user data.
     */
    async register(username: string, firstName: String, lastName: String, email: string, password: string, role: roles): Promise<Partial<IUser> | null> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, role, firstName, lastName });

        return {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
    }

    /**
     * Authenticates a user by checking their username/email and password, and returns a JWT token if valid.
     *
     * @param identifier - The username or email of the user attempting to log in.
     * @param password - The user's password.
     * @returns A signed JWT token if authentication is successful; otherwise, `null`.
     */
    async login(identifier: string, password: string): Promise<string | null> {
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (user && await bcrypt.compare(password, user.password)) {
            return jwt.sign({ id: user._id, role: user.role }, config.JWT.SECRET, { expiresIn: config.JWT.EXPIRY });
        }

        return null;
    }
}
