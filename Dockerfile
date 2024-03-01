FROM node:alpine
WORKDIR /app
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=8192
RUN npm install
RUN npm run build
EXPOSE 4554
CMD ["npm", "run", "start"]