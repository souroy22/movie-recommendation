FROM node:20-alpine as build

WORKDIR /builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine as Runner
WORKDIR /app
COPY --from=build /builder/dist ./dist
COPY --from=build /builder/package*.json ./
RUN npm ci --production
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/main.js"]
