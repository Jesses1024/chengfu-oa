FROM nginx:1.13
RUN rm -v /etc/nginx/nginx.conf
ADD nginx/nginx.conf /etc/nginx/nginx.conf
ADD ./dist /usr/share/nginx/html
