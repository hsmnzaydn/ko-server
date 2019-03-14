FROM node:8
WORKDIR ./
COPY package*.json ./
RUN npm install
ENV TZ 'Europe/Istanbul'
    RUN echo $TZ > /etc/timezone && \
    apt-get update && apt-get install -y tzdata && \
    rm /etc/localtime && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
