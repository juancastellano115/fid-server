FROM node:12-buster
LABEL maintainer="Juan Castellano"
RUN apt-get update
RUN apt-get install python3
#RUN apk add make g++ libc6-compat
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 4000
CMD ["npm","start"]