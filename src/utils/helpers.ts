import type { ServerResponse } from 'node:http';
import { validate } from 'uuid';
import type { StatusCodeEnum } from './enums';

export const endResponse = (response: ServerResponse, statusCode: StatusCodeEnum): void => {
    response.statusCode = statusCode;
    response.end();
};

export const getJSONBody = (body: Buffer[]) => {
    return JSON.parse(Buffer.concat(body).toString());
};

export const isValidUserId = (userId: string | undefined): boolean => {
    return !!userId && validate(userId);
}