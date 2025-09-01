# Use Node.js 21 with Debian (bullseye)
FROM node:21-bullseye

# Set working directory
WORKDIR /app

# Copy only package files to install dependencies first (faster caching)
COPY package*.json ./

# Install Vite + other deps (skip peer deps conflicts)
RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
