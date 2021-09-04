# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /sus
COPY package*.json ./
RUN npm install
COPY ./ .