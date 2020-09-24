FROM node:10-slim
# FROM node:10.15.3-alpine

RUN mkdir -p /app/school_db
WORKDIR /app/school_db

COPY package*.json ./

RUN npm install
COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start
#CMD npm start
