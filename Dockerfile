# Use a small Node image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Expose the port (same as in .env or default 3031)
EXPOSE 3031

# Use environment variables from .env at runtime
CMD ["npm", "start"]
