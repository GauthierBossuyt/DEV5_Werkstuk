FROM node:latest

WORKDIR /USR/werkstuk


COPY package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 3000


CMD ["npm" ,"test"]