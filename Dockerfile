FROM node:20.18.3-slim

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

RUN npm i -D typescript tsx

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]