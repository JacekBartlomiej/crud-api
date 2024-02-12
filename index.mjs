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
    } else {
      response.statusCode = 404;
      response.end('Path does not exists')
    }
  })
  .listen(8080);

const handlePostUser = (request, response) => {
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
      if (Object.values(body).length === 3 &&
        body.username &&
        typeof body.username === 'string' &&
        body.age &&
        typeof body.age === 'string' &&
        body.hobbies &&
        Array.isArray(body.hobbies)) {
        let newUser;
        if (users.length) {
          newUser = { id: users.length + 1, ...body };
        } else {
          newUser = { id: 1, ...body };
        }
        users.push(newUser);
        response.statusCode = 201;
        response.end(JSON.stringify({ data: { user: newUser } }))
      } else {
        response.statusCode = 400;
        response.end("Request body does not contain required fields")
      }
    });
}