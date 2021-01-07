FROM 10.34.8.240:5000/nginx:V1.0-git
ADD dist.tar /usr/share/nginx/html/
ADD check_web.sh /root/
WORKDIR /usr/share/nginx/html/
RUN git init
RUN git add .
RUN git config --global user.name "oraro"
RUN git config --global user.email "nginx@oraro.net"
RUN git commit -m "First web"
