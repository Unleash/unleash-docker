FROM node:12-alpine

ENV NODE_ENV production

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 4242

CMD node index.js
