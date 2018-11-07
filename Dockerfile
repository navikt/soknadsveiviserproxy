FROM node:10 as node-builder

ENV CI=true
WORKDIR /app

EXPOSE 8080

COPY package*.json /app/
COPY index.js /app/

RUN npm install
CMD ["node", "index.js"]
