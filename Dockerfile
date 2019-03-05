FROM node:12-alpine

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 80

CMD node index.js
