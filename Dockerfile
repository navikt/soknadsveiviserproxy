FROM node:10.15.0

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
ENV NODE_ENV production
ENV CI=true

WORKDIR /app

COPY src/ ./src
COPY index.js ./
COPY package.json ./
COPY package-lock.json ./

EXPOSE 8080

RUN npm install
CMD ["node", "index.js"]
