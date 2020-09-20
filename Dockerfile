FROM node:12

RUN apt-get update

WORKDIR /usr/src/app

RUN mkdir /scripts

COPY src/package*.json ./

RUN npm install knex -g

RUN npm install

COPY src/ .

RUN npm install swagger-jsdoc -g

RUN npm i mocha -g

EXPOSE 3000

