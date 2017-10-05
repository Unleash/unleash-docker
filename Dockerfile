FROM node:8-alpine

COPY package.json ./

RUN npm install --production

COPY . .

RUN chmod +x ./wait-for

EXPOSE 4242

CMD node index.js

