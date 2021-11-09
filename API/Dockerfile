FROM node:16

WORKDIR /USR/werkstuk

COPY package*.json ./

RUN npm install

EXPOSE 3000

COPY . .

CMD npm test