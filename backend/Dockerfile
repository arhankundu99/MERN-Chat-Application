FROM node

WORKDIR /chat-app/backend

COPY ./ ./

RUN npm install

RUN npm install -g nodemon

EXPOSE 8080

CMD ["nodemon", "index.js"]
