FROM node:18 AS build
WORKDIR /app
COPY package.json package.json
RUN yarn install
COPY . .
RUN yarn build

FROM nginx
COPY --from=build /app/build /opt/site
COPY nginx.conf /etc/nginx/nginx.conf
