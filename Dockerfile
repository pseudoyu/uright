FROM nginx:alpine
COPY dist/copyrightly-io /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
