import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/api-response.util';

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, role, firstName, lastName } = req.body;
        const user = await authService.register(username, firstName, lastName, email, password, role);

        // Send success response with created status
        sendSuccessResponse(res, 201, {
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        // Send error response with internal server error status
        sendErrorResponse(res, 500, {
            message: 'Error registering user',
            error,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);

        if (token) {
            // Send success response for valid login
            sendSuccessResponse(res, 200, {
                message: 'Logged in successfully',
                data: { token },
            });
        } else {
            // Send unauthorized error response for invalid credentials
            sendErrorResponse(res, 401, {
                message: 'Invalid credentials',
            });
        }
    } catch (error) {
        // Send error response with internal server error status
        sendErrorResponse(res, 500, {
            message: 'Error logging in',
            error,
        });
    }
};
