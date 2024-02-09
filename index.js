const http = require("node:http");

http
  .createServer((request, response) => {
    console.log("hello", request);
    console.log("request.method", request.method);
    console.log("request.url", request.url);
    if (request.method === "GET" && request.url === "/api/users") {
      response.statusCode = 200;
      response.end('{users: []}');
    } else {
      response.statusCode = 404;
      response.end('Path does not exists')
    }
  })
  .listen(8080);

