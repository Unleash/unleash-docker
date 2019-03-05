FROM node:8-alpine

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 80

CMD node index.js
