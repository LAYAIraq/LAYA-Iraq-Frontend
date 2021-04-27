FROM nginx:stable-alpine

# Copy production-ready build into Docker
COPY . /usr/share/nginx/html

# Expose the build at Port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
