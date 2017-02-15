FROM node:7.5

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 4242

CMD node index.js

