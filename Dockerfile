FROM node:16 as base

WORKDIR /app

COPY package*.json ./

FROM base as prod
RUN npm ci --only=production

COPY . .

ENV PORT ${PORT}

EXPOSE ${PORT}
CMD ["npm", "start"]

FROM base as test
RUN npm install

COPY . .

CMD ["npm", "test"]