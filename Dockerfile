FROM node:12

WORKDIR /usr/src/app

COPY src/package*.json ./

#RUN npm install -g mocha gulp
RUN npm install knex -g

RUN npm install

#RUN npm link gulp --no-bin-links

COPY src/ .

EXPOSE 3000