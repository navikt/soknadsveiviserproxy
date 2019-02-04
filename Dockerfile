FROM node:10.15.0

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
ENV NODE_ENV production
ENV CI=true

WORKDIR /app

EXPOSE 8080

COPY package*.json /app/
COPY index.js /app/

RUN npm install
CMD ["node", "index.js"]
