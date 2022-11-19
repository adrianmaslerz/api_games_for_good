FROM node:14.15.4-alpine
RUN apk update && apk add bash && apk add curl

#create workdir
ARG APP_DIR=/usr/src/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

#install dependencies
COPY package*.json $APP_DIR/
RUN npm install

#copy source
COPY src $APP_DIR/src
COPY test $APP_DIR/test
COPY .eslintrc.js $APP_DIR/.eslintrc.js
COPY .prettierrc $APP_DIR/.prettierrc
COPY nest-cli.json $APP_DIR/nest-cli.json
COPY mikro-orm.config.ts $APP_DIR/mikro-orm.config.ts
COPY tsconfig.build.json $APP_DIR/tsconfig.build.json
COPY tsconfig.json $APP_DIR/tsconfig.json

#install globals
RUN npm i -g @nestjs/cli
RUN npm link webpack
RUN nest build

CMD [ "node", "dist/src/main" ]
