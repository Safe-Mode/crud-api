import { env } from 'node:process';
import request from 'supertest';
import { getType } from 'jest-get-type';
import * as dotenv from 'dotenv';
import { validate } from 'uuid';

dotenv.config();

const baseUrl = `${env['API_HOST']}:${env['API_PORT']}/api/`;
let user = {};
let userId = '';

describe('Get all users', () => {
    it('should return status 200 and empty array', async () => {
        const { status, body } = await request(baseUrl)
            .get('users')
            .expect(({ body }) => body.body = []);

        expect(status).toBe(200);
        expect(body.body).toStrictEqual([]);
    });
});

describe('Post new user', () => {
    it('should return status 201 and post new user and return it at the response', async () => {
        const { status, body } = await request(baseUrl)
            .post('users')
            .send({
                username: 'Sergey',
                age: 32,
                hobbies: ['moto', 'photo']
            });

        const { id, username, age, hobbies } = body.body;

        user = body.body;
        userId = id;
        
        expect(status).toBe(201);
        expect(validate(id)).toBeTruthy();
        expect(getType(username)).toBe('string');
        expect(getType(age)).toBe('number');
        expect(getType(hobbies)).toBe('array');
    });

    it('should return status 200 and newly created user', async () => {
        const { status, body } = await request(baseUrl)
            .get(`users/${userId}`)
            .expect(({ body }) => body.body = user);

        expect(status).toBe(200);
        expect(body.body).toStrictEqual(user);
    });
});

describe('Affect on existing user', () => {
    const newUsername = 'Sergey Dmitriev';
    
    it('should update existing user and return status 200', async () => {
        const { status, body } = await request(baseUrl)
            .put(`users/${userId}`)
            .send({
                username: newUsername,
            });

        const newUser = body.body;

        expect(status).toBe(200);
        expect(newUser).toStrictEqual({
            ...user,
            username: newUsername
        });
    });

    it('should delete existing user by id and return status 204', async () => {
        const { status } = await request(baseUrl)
            .delete(`users/${userId}`)
            .expect((response) => response.status = 204);

        expect(status).toBe(204);
    });
});
