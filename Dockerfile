FROM node:lts-alpine as builder

RUN apk add --update git && rm -rf /var/cache/apk/*

# use npm server for Testing Purposes, uncomment for testing build
RUN npm install -g http-server

WORKDIR /laya-frontend

COPY package*.json ./
RUN npm install

COPY . .

# Build Production version of LAYA frontend
RUN npm run build

EXPOSE 8080
CMD ["http-server", "dist"]




