FROM node:current-slim AS development

ARG NODE_ENV=production
ARG API_URL

ENV NODE_ENV=$NODE_ENV
ENV CI=true
ENV API_URL=$API_URL

WORKDIR /usr/src
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
WORKDIR /usr/src/app
COPY . .

CMD [ "npm", "start" ]

FROM development AS builder

RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html