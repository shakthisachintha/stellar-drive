FROM node:14.16.0-alpine3.13
RUN npm install pm2 -g
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY ./build . 
EXPOSE 3001 
CMD ["pm2-runtime","index.js"]