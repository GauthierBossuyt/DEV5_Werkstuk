FROM node:latest

WORKDIR /USR/werkstuk

COPY ./ ./

COPY package*.json ./

RUN npm install

EXPOSE 3000


CMD ["npm" ,"test"]