FROM node:16
RUN yarn add -D prisma

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn
RUN npx prisma generate

CMD [ "yarn", "start" ]