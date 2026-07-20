#Stage 1 - build your angular app
FROM node:22-alpine AS build

WORKDIR /app

#copy package file
COPY package*.json ./

#install npm dependencies
RUN npm install

#copy source code
COPY . .

#build angular app
RUN npm run build -- --configuration=production


#stage 2 - serve app with nginx server
FROM nginx:alpine

#copy built angular app from stage 1
COPY --from=build /app/dist/ecommerce-ui/browser /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf

#expose port 80
EXPOSE 80

#start nginx server
CMD ["nginx", "-g", "daemon off;"]