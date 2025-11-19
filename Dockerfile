FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["node", "dist/index.js"]