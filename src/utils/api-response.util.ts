import { Response } from "express";
import { httpStatusCodes } from "./http-status-code.util";

export interface ApiResponse<T> {
    status: string;
    message: string;
    data?: T; // Optional data field
    error?: T; // Optional error field
}

export const sendSuccessResponse = <T>(
    res: Response,
    statusCode: number = 200,
    { message, data }: { message: string; data?: T }
) => {
    const response: ApiResponse<T> = {
        status: httpStatusCodes[statusCode],
        message,
    };

    // Add data to the response only if it's present
    if (data !== undefined) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

export const sendErrorResponse = <T>(
    res: Response,
    statusCode: number = 500,
    { message, error }: { message: string; error?: any }
) => {
    const response: ApiResponse<T> = {
        status: httpStatusCodes[statusCode],
        message,
    };

    // Add data to the response only if it's present
    if (error !== undefined) {
        response.error = error;
    }

    return res.status(statusCode).json(response);
};
