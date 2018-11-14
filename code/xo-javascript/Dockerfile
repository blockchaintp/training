FROM mhart/alpine-node:8
MAINTAINER kai@blockchaintp.com
RUN apk update && apk upgrade && apk add bash git python alpine-sdk
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
RUN yarn install
COPY ./src /app/src
WORKDIR /app
ENTRYPOINT ["node", "src/index.js"]