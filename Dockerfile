FROM node:alpine

COPY . app/

WORKDIR /app
RUN npm install

ENV FASTIFY_ADDRESS=0.0.0.0

CMD ["npm", "start"]
