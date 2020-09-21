# World Texting Foundation (WTF)

## ⬢ NodeJS Test

Messaging acronyms are everywhere now. Do you know all of them?

Build a REST API for the **World Texting Foundation**, also known as **WTF**.

A sample JSON data file will be provided with a base set of acronym definitions. We expect you to create a NodeJS server
using modern best practices for API development. Please consider the recommendations attached as this will list the
items we are looking for above.

These endpoints should be created:

- **`GET /acronym?from=50&limit=10&search=:search`**
  - ▶ returns a list of acronyms, paginated using query parameters
  - ▶ response headers indicate if there are more results
  - ▶ returns all acronyms that fuzzy match against `:search`
- **`GET /acronym/:acronym`**
  - ▶ returns the acronym and definition matching `:acronym`
- **`GET /random/:count?`**
  - ▶ returns `:count` random acronyms
  - ▶ the acronyms returned should not be adjacent rows from the data
- **`POST /acronym`**
  - ▶ receives an acronym and definition strings
  - ▶ adds the acronym definition to the db
- **`PUT /acronym/:acronym`**
  - ▶ receives an acronym and definition strings
  - ▶ uses an authorization header to ensure acronyms are protected
  - ▶ updates the acronym definition to the db for `:acronym`
- **`DELETE /acronym/:acronym`**
  - ▶ deletes `:acronym`
  - ▶ uses an authorization header to ensure acronyms are protected

## The Data

Database is stored in MySql 8

## build docker images

`docker-compose build`

## Running container (dev)

Run the mysql container: `docker-compose run -d db-server`
Or Run the app container for dev: `docker-compose run -p  3000:3000  wtf-client bash`

## Run all the containers

`docker-compose up -d`

## Swagger documentation

`http://localhost:3000/api-docs/`

`http://servername:3000/api-docs`
