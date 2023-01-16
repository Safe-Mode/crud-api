# CRUD API
## Getting Started
First of all you should to install dependencies
```bash
npm i
```
## Scripts
Start project for development
```bash
npm run start:dev
```
Build project in production mode
```bash
npm run start:prod
```
You can run some tests (project should be started in one of the two available modes)
```bash
npm test
```
## Routes
Project starts at localhost:3200
### GET
Get all users
```bash
api/users
```
Get user by uuid
```bash
api/users/{userId}
```
### POST
Add new user
```bash
api/users
```
Request body example (all fields are required)
```js
{
    username: 'Kenny McCormick',
    age: 9,
    hobbies: ['die']
}
```
Returns new user
### PUT
Update user by uuid
```bash
api/users/{userId}
```
Request body is the same as for POST (full or partial update is available)<br />
Returns updated user
### DELETE
Delete user by uuid
```bash
api/users/{userId}
```
<b>GG!</b>
<b>GLHF!</b>
