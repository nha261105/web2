FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build code TypeScript sang JS
RUN npm run build

# Railway sẽ tự inject PORT vào biến môi trường, 
# không nên fix cứng EXPOSE nếu không cần thiết, nhưng có thể để biến ở đây
EXPOSE ${PORT}

# Chạy lệnh preview để phục vụ file đã build
CMD ["npm", "run", "preview"]