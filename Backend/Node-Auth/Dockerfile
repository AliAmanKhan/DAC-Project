# ---------- Base Image ----------
FROM node:20-alpine

# ---------- Set Working Directory ----------
WORKDIR /app

# ---------- Copy package files first (for caching) ----------
COPY package*.json ./

# ---------- Install only production dependencies ----------
RUN npm install --omit=dev

# ---------- Copy rest of the application ----------
COPY . .

# ---------- Use Render's dynamic PORT ----------
ENV PORT=3050

# ---------- Expose port (Render overrides internally) ----------
EXPOSE 3050

# ---------- Start application ----------
CMD ["node", "index.js"]
