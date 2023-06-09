# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory to the container
COPY . .

# Build the React project
RUN npm run build

# Expose the desired port
EXPOSE 3002

# Set the command to run when the container starts
CMD ["npm", "start"]