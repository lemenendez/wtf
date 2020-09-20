FROM node:12

RUN apt-get update

# RUN apt-get install mysql-client -y

WORKDIR /usr/src/app

RUN mkdir /scripts

COPY src/package*.json ./

RUN npm install knex -g

RUN npm install

COPY src/ .

EXPOSE 3000