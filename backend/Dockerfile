# ── Backend Dockerfile ──────────────────────────────────────────────────────
# Base image: Node 18 LTS (slim)
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (layer-cache optimisation)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Expose the port the server listens on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
