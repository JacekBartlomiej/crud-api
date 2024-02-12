import http from 'node:http';

const users = [];

http
  .createServer((request, response) => {
    console.log("hello", request);
    console.log("request.method", request.method);
    console.log("request.url", request.url);
    if (request.method === "GET" && request.url === "/api/users") {
      response.statusCode = 200;
      response.end(JSON.stringify({ data: { users: users } }))
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

const handlePutUser = (request, response) => {
  const id = +request.url.replace("/api/users/", "");
  console.log("id", id);
  if (id) {
    console.log("users", users);
    const user = users.find(user => user.id === id);
    console.log("user", user);
    if (user) {
      handleBody(request, (body) => {
        const newUser = {...user, ...body};
        const userIndex = users.findIndex((user => user.id === id));
        users[userIndex] = newUser;
        response.statusCode = 201;
        response.end(JSON.stringify({ data: { user: newUser } }))
      },
        () => {
          response.statusCode = 400;
          response.end("Request body does not contain required fields")
        })
    }
  }
}

const handlePostUser = (request, response) => {
  handleBody(request, (body) => {
    let newUser;
    if (users.length) {
      newUser = { id: users.length + 1, ...body };
    } else {
      newUser = { id: 1, ...body };
    }
    users.push(newUser);
    response.statusCode = 201;
    response.end(JSON.stringify({ data: { user: newUser } }))
  },
    () => {
      response.statusCode = 400;
      response.end("Request body does not contain required fields")
    })
}

const isBodyValid = (body) => Object.values(body).length === 3 &&
  body.username &&
  typeof body.username === 'string' &&
  body.age &&
  typeof body.age === 'string' &&
  body.hobbies &&
  Array.isArray(body.hobbies);

const handleBody = (request, bodyValidCallback, bodyInvalidCallback) => {
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
        bodyInvalidCallback();
      }
    });
}