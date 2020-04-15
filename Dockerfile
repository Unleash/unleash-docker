FROM node:12-alpine

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 4242

CMD node index.js
