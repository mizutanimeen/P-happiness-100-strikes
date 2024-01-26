FROM nginx:1.25.3-alpine

RUN rm -f /etc/nginx/conf.d/*
COPY ./proxy/default.conf /etc/nginx/conf.d/default.conf

CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
