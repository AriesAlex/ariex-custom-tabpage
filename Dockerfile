FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4554
CMD ["npm", "run", "start"]