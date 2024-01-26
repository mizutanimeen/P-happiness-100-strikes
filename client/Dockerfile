FROM node:20.11-alpine3.18

COPY ./client/app/ /app

WORKDIR /app

RUN yarn install

CMD sh -c "yarn start"
