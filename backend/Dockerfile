FROM python:3.8-slim

RUN pip install spleeter

RUN apt-get update
RUN apt-get install -y nodejs curl gnupg gnupg2 gnupg1 libsndfile1 ffmpeg

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y yarn

COPY ./ /home/node
WORKDIR /home/node

RUN yarn install --immutable

ENV MONGO_URL=db

# 3333
CMD yarn start