FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Setup database at startup (when DB is available), then start the app
CMD sh -c "npm run db:setup && npm run start"