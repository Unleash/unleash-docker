FROM node:14-alpine as builder

WORKDIR /unleash

COPY index.js package.json package-lock.json ./

RUN npm ci

FROM node:14-alpine

ENV NODE_ENV production

WORKDIR /unleash

COPY --from=builder /unleash /unleash

RUN rm -rf /usr/local/lib/node_modules/npm/

EXPOSE 4242

USER node

CMD node index.js
