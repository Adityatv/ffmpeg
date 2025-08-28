FROM node:18

# Install ffmpeg & curl
RUN apt-get update && apt-get install -y ffmpeg curl

# Set working dir
WORKDIR /app

# Copy files
COPY package.json .
COPY server.js .
COPY mkv_to_hls.sh .
RUN mkdir -p /app/public

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
