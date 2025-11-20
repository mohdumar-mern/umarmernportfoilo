#  Use a lightweight Node.js image
FROM node:24-alpine3.21

#  Set working directory
WORKDIR /app

#  Copy only package files first for layer caching
COPY package*.json ./ 

#  Install only production dependencies
RUN npm install --omit=dev

#  Copy the rest of your source code
COPY . .


#  Set environment variable
ENV NODE_ENV=production

#  Expose your backend API port (e.g., 3000)
EXPOSE 3000

#  Start the server using the start script in package.json
CMD ["npm", "start"]
