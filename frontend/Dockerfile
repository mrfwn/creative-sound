FROM node:14.16-alpine

COPY ./ /home/node
WORKDIR /home/node

RUN yarn install --frozen-lockfile

# 3000
CMD yarn start