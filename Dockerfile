FROM node:alpine
WORKDIR /app
COPY . . 
# ENV NODE_ENV=production
RUN npm install
RUN npx prisma generate
CMD [ "npm","run","start" ]