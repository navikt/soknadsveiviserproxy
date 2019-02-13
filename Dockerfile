FROM node:10.15.0

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
ENV NODE_ENV production
ENV CI=true

COPY app /app
WORKDIR /app

EXPOSE 8080

RUN npm install
CMD ["node", "index.js"]
