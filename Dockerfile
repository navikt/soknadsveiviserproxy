FROM node:11.7.0

RUN ln -fs /usr/share/zoneinfo/Europe/Oslo /etc/localtime
ENV NODE_ENV production
ENV CI=true

COPY app /app
WORKDIR /app

RUN rm -rf node_modules
RUN npm install
CMD ["node", "index.js"]

EXPOSE 8080
