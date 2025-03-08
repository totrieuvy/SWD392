# Sử dụng node 20 để build ứng dụng Vite
FROM node:20 AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và lock file, sau đó cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Vite
RUN npm run build

# ------------------------------
# Sử dụng Nginx để phục vụ ứng dụng đã build
FROM nginx:latest

# Xóa cấu hình mặc định và thêm file cấu hình mới
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép mã nguồn đã build vào thư mục Nginx phục vụ
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
