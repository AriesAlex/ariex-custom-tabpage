FROM node:24-alpine AS build
WORKDIR /app
ENV NODE_OPTIONS=--max_old_space_size=8192
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4554
COPY --from=build /app/.output ./.output
EXPOSE 4554
CMD ["node", ".output/server/index.mjs"]
