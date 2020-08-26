FROM node:11.7.0

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
ENV NODE_ENV production
ENV CI=true

WORKDIR /app

COPY src/ ./src
COPY index.js ./
COPY package.json ./
COPY package-lock.json ./
COPY start.sh ./

RUN npm install
EXPOSE 8080
ENTRYPOINT ["/bin/sh", "start.sh"]
