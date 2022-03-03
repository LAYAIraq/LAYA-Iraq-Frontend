# laya-vechta-frontend

This is the repository for LAYA. Here, we continue developing new features for the inclusive learning platform.

This repository is also used for deploying LAYA to production.

## Deploying the project

There are two ways to deploy LAYA:

- deploying to a server directly 
- deploying in a Docker container

In both cases, you can set the backend URL on which the [LAYA Backend](https://gitlab.informatik.hu-berlin.de/laya/vechta/laya-vechta-backend) runs. By default, it is set to `/api` on the same location. Make sure to have your server set up to accept HTTP requests at this address.

If you want to set an individual URL, you need to add a `.env` file in the root folder of the project. It takes three arguments:

- `VUE_APP_BACKEND_HOST`: the host where the back end is running. Omit to default to same location as the front end
- `VUE_APP_BACKEND_PORT`: the port on which the backend is listening. Omit to default port (80 for HTTP, 443 for HTTPS)
- `VUE_APP_BACKEND_ROOT`: the location at which the back end accepts HTTP requests. Needs to include the slash at the beginning (e.g. `/requests`). Omit to default to `/api`
- `VUE_APP_MAX_FILE_SIZE`: the maximum amount of bytes for file upload. Defaults to 
  500000000

### Server
In order to deploy to a server, you need to have node installed (version 16). Clone the repository and run `npm install`. Set the environment file if your back end is running anywhere else than `/api`.

The run `npm run build`. The project will be built in the `dist` directory. The content of that directory can then be copied to the root directory of your web server.

### Docker

You need Docker to build the Docker image. Set the environment variables for the back end URL if neccessary. Then run `docker build -t laya-frontend .` to build the Docker container locally.

In order to run the Container on your server, run `docker run -td -p 8000:80 laya-frontend` on your server. `8000` is the port at which your host will serve LAYA. You can modify it for your needs. For an SSL secured connection, you will need to set up a reverse proxy.

## Developers

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
