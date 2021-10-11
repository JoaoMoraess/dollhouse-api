FROM node:16
RUN yarn add -D prisma

RUN mkdir /app
WORKDIR /app

COPY ./ ./prisma/

CMD [ "npx", "prisma", "migrate", "dev"]