FROM mhart/alpine-node:8 AS build-env
MAINTAINER kaiyadavenport@gmail.com
RUN apk update
RUN apk upgrade
RUN apk add bash git

WORKDIR /app/website
COPY ./package.json /app/website/package.json
COPY ./yarn.lock /app/website/yarn.lock
RUN yarn install
COPY . /app/website
RUN yarn run build
RUN yarn run publish

FROM nginx:alpine
MAINTAINER kai@blockchaintp.com
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build-env /app/website/public /www

