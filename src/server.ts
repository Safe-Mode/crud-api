import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4, validate } from 'uuid';

import type { User } from './types';
import { ContentTypeEnum, EventEnum, HeaderEnum, MessageEnum, MethodEnum, StatusCodeEnum } from './enums';
import { API_PORT, API_ENDPOINT, USER_ID_INDEX, NOT_FOUND_INDEX } from './const';

const users: User[] = [];

const endResponse = (response: ServerResponse, statusCode: StatusCodeEnum): void => {
    response.statusCode = statusCode;
    response.end();
};

const getJSONBody = (body: Buffer[]) => {
    return JSON.parse(Buffer.concat(body).toString());
};

createServer((request: IncomingMessage, response: ServerResponse) => {
    const { method, url, headers } = request;
    let result: User | User[] | string;

    request.on(EventEnum.ERROR, ({ stack }: Error) => {
        console.error(stack);
        endResponse(response, StatusCodeEnum.BAD_REQUEST);
    });

    response.on(EventEnum.ERROR, (error: Error) => {
        console.error(error);
        endResponse(response, StatusCodeEnum.SERVER_ERROR);
    });

    response.setHeader(HeaderEnum.CONTENT_TYPE, ContentTypeEnum.APP_JSON);

    if (headers['content-type'] !== ContentTypeEnum.APP_JSON) {
        endResponse(response, StatusCodeEnum.BAD_REQUEST);
    }

    if (url?.startsWith(API_ENDPOINT)) {
        const body: any[] = [];
        
        request
            .on(EventEnum.DATA, (chunk: any) => {
                const userId = url.split('/')[USER_ID_INDEX];

                switch (method) {
                    case MethodEnum.GET: {
                        if (userId && validate(userId)) {
                            const user = users.find((user) => (user.id === userId));
        
                            if (user) {
                                response.statusCode = StatusCodeEnum.SUCCESS;
                                result = user;
                            } else {
                                response.statusCode = StatusCodeEnum.NOT_FOUND;
                                result = MessageEnum.USER_NOT_FOUND;
                            }
                        } else if (userId) {
                            response.statusCode = StatusCodeEnum.BAD_REQUEST;
                            result = MessageEnum.INVALID_UUID;
                        } else {
                            response.statusCode = StatusCodeEnum.SUCCESS;
                            result = users;
                        }
        
                        break;
                    }
                    case MethodEnum.POST: {
                        body.push(chunk);
                        const { username, age, hobbies }: User = getJSONBody(body);
                        
                        if (typeof username !== 'string'
                            || typeof age !== 'number'
                            || !Array.isArray(hobbies)
                            || hobbies.some((hobby) => (typeof hobby !== 'string'))) {
                            response.statusCode = StatusCodeEnum.BAD_REQUEST;
                            result = MessageEnum.REQUIRED_FIELDS;
                        } else {
                            const newUser: User = {
                                id: uuidv4(),
                                username,
                                age,
                                hobbies
                            };

                            users.push(newUser);
                            result = newUser;
                            response.statusCode = StatusCodeEnum.CREATED;
                        }
                        
                        break;
                    }
                    case MethodEnum.PUT: {
                        body.push(chunk);
                        const { username, age, hobbies }: User = getJSONBody(body);

                        if (!userId || !validate(userId)) {
                            result = MessageEnum.INVALID_UUID;
                            response.statusCode = StatusCodeEnum.BAD_REQUEST;
                        } else {
                            let userIndex = null;

                            const user = users.find((user, index) => {
                                const hasUserFound = user.id === userId;
                                userIndex = hasUserFound ? index : null;
                                return hasUserFound;
                            });

                            result = user ? {
                                id: user.id,
                                username: username ?? user.username,
                                age: age ?? user.age,
                                hobbies: hobbies ?? user.hobbies
                            } : MessageEnum.USER_NOT_FOUND;

                            if (typeof userIndex === 'number') {
                                users[userIndex] = result as User;
                            }

                            response.statusCode = user ? StatusCodeEnum.SUCCESS : StatusCodeEnum.NOT_FOUND;
                        }

                        break;
                    }
                    case MethodEnum.DELETE: {
                        if (!userId || !validate(userId)) {
                            result = MessageEnum.INVALID_UUID;
                            response.statusCode = StatusCodeEnum.BAD_REQUEST;
                        } else {
                            const userIndex = users.findIndex((user) => (user.id === userId));
                            const hasUserFound = userIndex !== NOT_FOUND_INDEX;

                            if (hasUserFound) {
                                users.splice(userIndex, 1);
                            }

                            response.statusCode = hasUserFound ? StatusCodeEnum.NO_CONTENT_SUCCESS : StatusCodeEnum.BAD_REQUEST;
                        }
                    }
                }
            })
            .on(EventEnum.END, () => {
                response.end(JSON.stringify({ headers, method, url, body: result }));
            });
    } else {
        endResponse(response, StatusCodeEnum.NOT_FOUND);
    }
})
.listen(API_PORT, () => {
    console.log(`${MessageEnum.PORT} ${API_PORT}`);
});