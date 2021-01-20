#build frontend in npm

FROM node:lts-alpine as builder
WORKDIR /laya-frontend

RUN apk add --update git

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build



# Build has to be done in NPM Project
FROM nginx:stable-alpine as production

# Copy production-ready build into Docker
COPY --from=builder /laya-frontend/dist /usr/share/nginx/html

# Expose the build at Port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]





