# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Install production dependencies
FROM node:18-alpine AS dependencies

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Stage 3: Run the application
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the production node_modules from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy the package.json file
COPY --from=dependencies /app/package.json ./

# Expose the port the app runs on
EXPOSE 8000

# Run the application using npm start
CMD ["npm", "start"]
