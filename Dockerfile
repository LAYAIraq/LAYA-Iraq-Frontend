# Build has to be done in NPM Project
FROM nginx:stable-alpine as production

# Copy production-ready build into Docker
WORKDIR /usr/share/nginx/html
COPY dist/* ./

# Expose the build at Port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]





