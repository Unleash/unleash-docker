FROM node:10-alpine

COPY package.json ./

RUN yarn install --production

COPY . .

EXPOSE 4242

CMD node index.js
