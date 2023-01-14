import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { validate } from 'uuid';

import type { User } from './types';
import { EventEnum, MessageEnum, MethodEnum, StatusCode } from './enums';
import { API_PORT, API_ENDPOINT } from './const';

const users: User[] = [];

createServer((request: IncomingMessage, response: ServerResponse) => {
    const { method, url, headers } = request;

    request.on(EventEnum.ERROR, ({ stack }: Error) => {
        console.error(stack);
        response.statusCode = StatusCode.BAD_REQUEST;
        response.end();
    });

    response.on(EventEnum.ERROR, (error: Error) => {
        console.error(error);
    });

    if (url?.startsWith(API_ENDPOINT)) {
        const body: any[] = [];
        let result: User | User[] | string;

        switch (method) {
            case MethodEnum.GET:
                const userId = url.split('/')[3];
                
                if (userId && validate(userId)) {
                    const user = users.find((user) => user.id === userId);

                    if (user) {
                        response.statusCode = StatusCode.SUCCESS;
                        result = user;
                    } else {
                        response.statusCode = StatusCode.NOT_FOUND;
                        result = 'The user with corresponding uuid is not found';
                    }
                } else if (userId) {
                    response.statusCode = StatusCode.BAD_REQUEST;
                    result = 'Invalid uuid';
                } else {
                    response.statusCode = StatusCode.SUCCESS;
                    result = users;
                }

                break;
            case MethodEnum.POST:
                break;
        }
        
        request
            .on(EventEnum.DATA, (chunk: any) => {
                body.push(chunk);
            })
            .on(EventEnum.END, () => {
                // result = Buffer.concat(body).toString();
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify({ headers, method, url, result }));
                response.end();
            });
    } else {
        response.statusCode = StatusCode.NOT_FOUND;
        response.end();
    }
})
.listen(API_PORT, () => {
    console.log(`${MessageEnum.PORT} ${API_PORT}`);
});