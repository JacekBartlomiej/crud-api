# crud-api

In order to run application please run the start script i.e. npm run start

When application is running you can perform operations such as 

GET USERS
http://localhost:8080/api/users
example response body: 
{"data":{"users":[]}}
{"data":{"users":[{"id":"3cec20a7-1961-4cf4-92be-0bd0b69547c8","username":"Jacek","age":"12","hobbies":["video games"]},{"id":"e69a7bf3-a569-4692-a64b-2dc78dd84799","username":"Robert","age":"24","hobbies":["video games"]},{"id":"1f7c8ef5-af2e-4aca-89de-610b649ff880","username":"Jacek","age":"12","hobbies":["video games"]}]}}

GET USER
http://localhost:8080/api/users/{{uuid}}

POST USER
http://localhost:8080/api/users
example request body:
{
    "username": "Jacek",
    "age": "12",
    "hobbies": ["video games"]
}
example response:
{"data":{"user":{"id":"1f7c8ef5-af2e-4aca-89de-610b649ff880","username":"Jacek","age":"12","hobbies":["video games"]}}}

PUT USER
http://localhost:8080/api/users/{{uuid}}
example request body:
{
    "username": "Jacek",
    "age": "12",
    "hobbies": ["video games"]
}
example response:
{"data":{"user":{"id":"1f7c8ef5-af2e-4aca-89de-610b649ff880","username":"Jacek","age":"12","hobbies":["video games"]}}}

First begin with adding some users by utilizing POST request as initially endpoint users will return no data

Please use POSTMAN or equivalent tool in order to perform api calls. Request body should be raw, text option