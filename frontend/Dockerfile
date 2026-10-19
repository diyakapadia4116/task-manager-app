# ── Frontend Dockerfile ─────────────────────────────────────────────────────
# Stage 1: Build the React app with Vite
FROM node:18 AS build

WORKDIR /app

# Copy dependency manifests first (layer-cache optimisation)
COPY package*.json ./

# Install all dependencies (including devDependencies needed to build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production bundle (output goes to /app/dist)
RUN npm run build

# ── Stage 2: Serve the built files with Vite preview ────────────────────────
FROM node:18

WORKDIR /app

# We need vite available to run the preview server
COPY package*.json ./
RUN npm install

# Copy the production build from stage 1
COPY --from=build /app/dist ./dist

# Expose the preview port
EXPOSE 5173

# Start Vite preview server bound to all interfaces so Docker can forward traffic
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
