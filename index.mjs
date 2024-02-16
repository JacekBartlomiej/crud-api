import http from 'node:http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const users = [];

http
  .createServer((request, response) => {
    console.log("hello", request);
    console.log("request.method", request.method);
    console.log("request.url", request.url);
    if (request.method === "GET" && request.url === "/api/users") {
      response.statusCode = 200;
      response.end(JSON.stringify({ data: { users: users } }))
    } else if (request.method === "GET" && request.url.includes("/api/users/")) {
      handleGetUser(request, response);
    } else if (request.method === "POST" && request.url === "/api/users") {
      handlePostUser(request, response);
    } else if (request.method === "PUT" && request.url.includes("/api/users/")) {
      handlePutUser(request, response);
    } else {
      response.statusCode = 404;
      response.end('Path does not exists')
    }
  })
  .listen(8080);

const handleGetUser = (request, response) => {
  handleUserId(request, response, (user) => {
    response.statusCode = 201;
    response.end(JSON.stringify({ data: { user } }))
  })
}

const handlePutUser = (request, response) => {
  handleUserId(request, response, (user, id) => {
    handleBody(request, (body) => {
      const newUser = { ...user, ...body };
      console.log('newUser', newUser);
      const userIndex = users.findIndex((user => user.id === id));
      console.log('userIndex', userIndex);
      console.log('users', users);
      users[userIndex] = newUser;
      response.statusCode = 201;
      response.end(JSON.stringify({ data: { user: newUser } }))
    })
  })
}

const handlePostUser = (request, response) => {
  handleBody(request, (body) => {
    const newUser = { id: uuidv4(), ...body };
    users.push(newUser);
    response.statusCode = 201;
    response.end(JSON.stringify({ data: { user: newUser } }))
  })
}

const isBodyValid = (body) => Object.values(body).length === 3 &&
  body.username &&
  typeof body.username === 'string' &&
  body.age &&
  typeof body.age === 'string' &&
  body.hobbies &&
  Array.isArray(body.hobbies);

const handleBody = (request, bodyValidCallback) => {
  let body = [];
  request
    .on('error', err => {
      console.error(err);
    })
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString());
      console.log('body', body);
      if (isBodyValid(body)) {
        bodyValidCallback(body);
      } else {
        handleInvalidBodyResponse(response);
      }
    });
}

const handleInvalidBodyResponse = (response) => {
  response.statusCode = 400;
  response.end("Request body does not contain required fields")
}

const handleUserId = (request, response, callbackIfUserIdValid) => {
  const id = request.url.replace("/api/users/", "");
  if (id) {
    if (uuidValidate(id)) {
      console.log("users", users);
      const user = users.find(user => user.id === id);
      console.log("user", user);
      if (user) {
        callbackIfUserIdValid(user, id)
      } else {
        response.statusCode = 404;
        response.end(`User with id: ${id} doesn't exist`)
      }
    } else {
      response.statusCode = 400;
      response.end(`User id: ${id} is invalid (is not uuid)`)
    }
  } else {
    response.statusCode = 400;
    response.end(`User id was not provided`)
  }
}