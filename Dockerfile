FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Setup the Database
RUN npm run db:setup

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]