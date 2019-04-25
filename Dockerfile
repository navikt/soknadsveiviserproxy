FROM node:11.7.0

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
ENV NODE_ENV production
ENV CI=true

WORKDIR /app

COPY src/ ./src
COPY index.js ./
COPY package.json ./
COPY package-lock.json ./

RUN npm install
CMD ["node", "index.js"]

EXPOSE 8080
