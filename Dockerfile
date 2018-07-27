FROM node:8.11.3-alpine

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 4242

CMD node index.js
