FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY portal/index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]