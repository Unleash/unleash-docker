FROM nodesource/wheezy:6

COPY . .

RUN npm install --production

EXPOSE 4242

CMD unleash
