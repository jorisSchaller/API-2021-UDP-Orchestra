from node:17

WORKDIR /opt/app/
COPY src .
COPY package.json . 
RUN npm install
ENTRYPOINT ["node", "/opt/app/app.js"]
