# ============================
# Stage 1 — Build CRA App
# ============================
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# CRA reads .env.production here
RUN npm run build



# ============================
# Stage 2 — Serve with Nginx
# ============================
FROM nginx:stable-alpine AS production

# Copy CRA build output to Nginx's public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
