FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Install SQLite
RUN apk add --no-cache sqlite sqlite-dev && \
    npm install better-sqlite3

COPY . .

# Setup the Database
RUN npm run db:setup

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
