# World Texting Foundation (WTF)

## Funtionally

Messaging acronyms are everywhere now. Do you know all of them? Build a REST API for the **World Texting Foundation**, also known as **WTF**.
A sample JSON data file will be provided with a base set of acronym definitions. We expect you to create a NodeJS server
using modern best practices for API development. Please consider the recommendations attached as this will list the items we are looking for above.

These endpoints should be created:

- **`GET /acronym?from=50&limit=10&search=:search`**
  - returns a list of acronyms, paginated using query parameters
  - response headers indicate if there are more results
  - returns all acronyms that fuzzy match against `:search`
- **`GET /acronym/:acronym`**
  - returns the acronym and definition matching `:acronym`
- **`GET /random/:count?`**
  - returns `:count` random acronyms
  - the acronyms returned should not be adjacent rows from the data
- **`POST /acronym`**
  - receives an acronym and definition strings
  - adds the acronym definition to the db
- **`PUT /acronym/:acronym`**
  - receives an acronym and definition strings
  - uses an authorization header to ensure acronyms are protected
  - updates the acronym definition to the db for `:acronym`
- **`DELETE /acronym/:acronym`**
  - deletes `:acronym`
  - uses an authorization header to ensure acronyms are protected

## The Data

Database is stored in MySql 8

## Running the containers

Create images: `docker-compose build`
Run the containers: `docker-compose up -d`

Open [http://localhost:3000/api-docs]

## Running container (dev)

Run the mysql container: `docker-compose run -d db-server`
Or Run the app container for dev: `docker-compose run -p  3000:3000 --entrypoint bash  wtf-client bash`
add -v to map the folder

## Run all the containers

`docker-compose up -d`

## Swagger documentation

`http://localhost:3000/api-docs/`

`http://servername:3000/api-docs`

## Security

Methods PUT /v1/acronym/{acronym} and DELETE /v1/acronym/{acronym} require the authorization header
The API accepts any valid Bearer

### Beared Valid Token

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.0flS6CW7wKowP05D5aTQTIAAc0GnNjwr7o5JEVgqwto`

It is possible to create a Bearer Token here: [https://jwt.io/](jwt.io)

## Running API test

Run the wtf-container
`docker-compose run -p  3000:3000 --entrypoint bash wtf-client`

Inside the container run:

`npm run test` out put example: `10 passing (548ms)`
