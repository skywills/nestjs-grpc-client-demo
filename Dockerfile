FROM node:18.19.0-alpine AS builder
WORKDIR /app/
ADD ./package.json /app/
ADD ./package-lock.json /app/
ADD ./tsconfig.json /app/
ADD ./tsconfig.build.json /app/
ADD ./src /app/src
RUN npm install glob rimraf
RUN npm install
COPY . .
RUN npm run build


FROM node:18.19.0-alpine
WORKDIR /app/
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist /app/dist
CMD ["npm", "run", "start:prod"]