**TRƯỜNG ĐẠI HỌC SÀI GÒN**

**KHOA CÔNG NGHỆ THÔNG TIN**

**HỌC PHẦN: LẬP TRÌNH WEB VÀ ỨNG DỤNG NÂNG CAO**

**BÁO CÁO ĐỒ ÁN WEB**

**WEBSITE QUẢN LÝ CHO THUÊ THIẾT BỊ (RENTGEAR)**

**Giảng viên hướng dẫn:** Nguyễn Thanh Sang\
**Nhóm:** Rentgear\
Thành viên (MSSV -- Họ tên -- Lớp):\
- 3123410039 - Lê Mạnh Cường - DCT1236\
- 3123410012 - Nguyễn Âu Gia Bảo - DCT1234\
- 3123410007 - Nguyễn Hoàng Anh - DCT1231\
- 3123410099 - Nguyễn Trần Công Danh - DCT1239

TP. Hồ Chí Minh, tháng 04 năm 2026

NHẬN XÉT CỦA GIẢNG VIÊN

# MỤC LỤC
1. CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI & CÔNG NGHỆ
2. CHƯƠNG 2. PHÂN TÍCH & THIẾT KẾ
3. CHƯƠNG 3. CÀI ĐẶT – TRIỂN KHAI – KIỂM THỬ
4. KẾT LUẬN & HƯỚNG PHÁT TRIỂN
5. PHỤ LỤC

---

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI & CÔNG NGHỆ.

## 1.1 Bối cảnh và lý do chọn đề tài

Trong bối cảnh kinh tế hiện nay, nhu cầu sử dụng các thiết bị chuyên dụng cao cấp như máy ảnh, ống kính, thiết bị quay phim (flycam, gimbal) ngày càng tăng cao nhưng chi phí mua mới rất đắt đỏ. Vì vậy, xu hướng chuyển từ "sở hữu" sang "thuê mượn" đang phát triển mạnh mẽ. Tuy nhiên, việc quản lý cho thuê thiết bị thủ công dễ gây thất thoát, nhầm lẫn lịch trình và khó khăn trong việc đối soát đền bù. Đề tài **"Website Quản Lý Cho Thuê Thiết Bị (Rentgear)"** được chọn với mục đích số hóa toàn bộ quy trình, giúp người dùng dễ dàng thuê thiết bị trực tuyến và giúp cửa hàng tự động hóa việc theo dõi lịch trình, tồn kho và tính phí trễ hạn.

## 1.2 Mục tiêu

-   Mục tiêu cho người mua (end-user): Cung cấp giao diện trực quan để tìm kiếm thiết bị, quản lý giỏ hàng dài ngày (chọn ngày thuê/trả), theo dõi trạng thái đơn thuê và kiểm tra lịch sử thuê/trả.
-   Mục tiêu cho quản trị (admin): Quản lý chi tiết danh mục, sản phẩm, kiểm soát tồn kho theo thời gian thực. Theo dõi vòng đời đơn hàng từ lúc xét duyệt, nhận cọc, lấy thiết bị đến khi trả hàng, tính toán chi phí đền bù (hư hỏng, mất mát, trễ hạn) và xem báo cáo doanh thu trực quan.

## 1.3 Phạm vi thực hiện

-   **Thực hiện:** Quản lý User (Authorization qua JWT), Quản lý Sản phẩm/Danh mục/Brands, Quản lý Giỏ hàng thuê thiết bị, Quản lý Đơn hàng đa trạng thái, Quản lý trả hàng kèm điều khoản phạt trễ.
-   **Không thực hiện:** Tích hợp cổng thanh toán trực tuyến (chỉ ghi nhận thanh toán/đặt cọc ảo dạng Transaction tay), giao hàng phức tạp (chỉ lưu ID địa chỉ).

## 1.4 Công nghệ sử dụng

-   Ngôn ngữ Backend: PHP (Framework Laravel 11.x)
-   Cơ sở dữ liệu: MySQL
-   Giao diện Frontend: TypeScript, ReactJS (Vite) kết hợp Tailwind CSS
-   State Management: Zustand & TanStack React Query
-   Lưu trữ hình ảnh: Supabase Storage.

## 1.5 Kế hoạch thực hiện và phân công

  ----------------- ------------------------- --------------------------------------- -----------------
  STT               Thành viên                Nhiệm vụ                                \% đóng góp
  1                 Lê Mạnh Cường             Phân tích hệ thống, Backend API (Cart)  25%
  2                 Nguyễn Âu Gia Bảo         Frontend UI (Admin Dashboard, Reports)  25%
  3                 Nguyễn Hoàng Anh          Cơ sở dữ liệu, Backend API (Rentals)    25%
  4                 Nguyễn Trần Công Danh     Frontend UI/UX (Client Pages)           25%
  ----------------- ------------------------- --------------------------------------- -----------------

# CHƯƠNG 2. PHÂN TÍCH & THIẾT KẾ.

## 2.1. PHÂN TÍCH HỆ THỐNG.

## 2.1.1 Đối tượng sử dụng

-   Khách (guest): Xem danh sách sản phẩm, danh mục, xem chi tiết giá thuê thiết bị.
-   Khách hàng (customer): Đăng nhập để thao tác giỏ hàng, tùy chỉnh ngày thuê/trả, đặt đơn thuê, cấu hình địa chỉ, xem lịch sử và trạng thái đơn hàng.
-   Quản trị viên (admin): Truy cập Dashboard chuyên biệt, quản lý users, sản phẩm, duyệt/hủy đơn thuê thiết bị, xác nhận quá trình trả hàng và ghi nhận hư hỏng (Rental Issues).

## 2.1.2 Danh sách chức năng

### A. End-user

-   Đăng ký / Đăng nhập / Đổi thông tin tài khoản.
-   Xem danh sách thiết bị cho thuê (Có lọc theo loại/brand, phân trang).
-   Quản lý giỏ hàng: Chọn ngày bắt đầu - ngày kết thúc để tính tổng tiền tự động, chỉnh số lượng sản phẩm.
-   Đặt hàng thuê thiết bị (Checkout).
-   Theo dõi tiến trình đơn hàng (PENDING, APPROVED, PICKED_UP, v.v.).

### B. Admin

-   Đăng nhập tài khoản admin (phân quyền Role/Permission).
-   Thống kê: Biểu đồ doanh thu dạng cột, số đơn hàng đang hoạt động, tỷ lệ thuê theo Category.
-   Quản lý danh mục, Brands, và Thiết bị (CRUD).
-   Quản lý đơn hàng: Xét duyệt, cập nhật trạng thái đơn (PENDING -> APPROVED -> PICKED_UP -> COMPLETED).
-   Quản lý trả hàng: Ghi nhận tình trạng đồ trả (GOOD, DAMAGED, LOST), tính phí và tự động cộng dồn tồn kho.
-   Quản lý User đăng ký hệ thống.

## 2.1.3 Đặc tả luồng thao tác

**Tên chức năng:** Checkout Giỏ hàng (Đặt Thuê)
- **Mục tiêu:** Lưu thông tin thuê đồ của User vào hệ thống.
- **Người thực hiện:** Khách hàng (Customer)
- **Dữ liệu vào:** Địa chỉ giao hàng, Ghi chú (Note), Ngày bắt đầu/kết thúc (đã chọn trong giỏ hàng).
- **Dữ liệu ra:** Đơn đặt hàng mới trạng thái PENDING.
- **Điều kiện trước:** Người dùng đã có JWT token và trong giỏ hàng có thiết bị.
- **Luồng chính:**
  1. Người dùng vào trang Checkout.
  2. Chọn/nhập địa chỉ giao hàng.
  3. Bấm "Thanh toán gửi đơn".
  4. Hệ thống kiểm tra số lượng tồn kho theo thời gian thực.
  5. Đổi trạng thái bảng `rentals` từ `CART` sang `PENDING`.
  6. Tính lại tổng tiền thuê theo công thức: (Tổng đơn giá hằng ngày) * (Số ngày thuê).
- **Luồng ngoại lệ:** Nếu có sản phẩm vượt quá tồn kho (Over-stock), trả về lỗi HTTP 422 hiển thị popup thông báo số lượng tồn không đủ. Nút checkout bị ngắt.

**Tên chức năng:** Trả thiết bị và phạt trễ hạn (Return Rental)
- **Mục tiêu:** Admin thu hồi lại máy móc và tự động tính lệ phí trễ / hư hỏng.
- **Người thực hiện:** Admin.
- **Dữ liệu vào:** Rental ID, dánh sách các chi tiết (detail) trả, tình trạng (GOOD/DAMAGED/LOST).
- **Dữ liệu ra:** Ticket trả hàng, phạt phiền toái, thay đổi tồn kho sản phẩm.
- **Luồng chính:**
  1. Admin mở đơn hàng, chọn thao tác "Trả hàng".
  2. Nhập trạng thái trả cho từng đồ vật.
  3. Backend Service tính toán xem ngày trả thực tế có trễ hơn ngày kết thúc hợp đồng hay không.
  4. Tự động sinh `RentalIssue` nếu trễ hoặc hư hỏng.
  5. Khôi phục lại số lượng Stock cho từng thiết bị và chuyển về ACTIVE nếu như thiết bị trong kho trước đó là 0.
- **Luồng ngoại lệ:** Nếu máy bị LOST, Stock sẽ KHÔNG được cộng lại.

# 2.2. THIẾT KẾ GIAO DIỆN & LUỒNG MÀN HÌNH

## 2.2.1 Sơ đồ sitemap 

-   Khách & User: `/` (Trang chủ) -> `/category` (Lọc theo danh mục) -> `/product/:slug` (Chi tiết máy) -> `/cart` -> `/checkout`
-   Tài khoản: `/account` (Lịch sử thuê), `/address` (Sổ địa chỉ).
-   Admin: `/admin` -> `/admin/rentals` (Đơn thuê), `/admin/products` (Kho máy), `/admin/users` (Người quản trị).

## 2.2.2 Danh sách màn hình

  ----------------- ------------------------- -------------------------------- -------------------------------------------
  Mã màn hình       Tên màn hình              Đối tượng                        Mô tả ngắn
  SCR_01            Home / Catalog            Tất cả (Guest/User)              Hiển thị danh sách thiết bị tổng quan
  SCR_02            Product Detail            Tất cả (Guest/User)              Mô tả kỹ thuật máy, thêm vào giỏ hàng
  SCR_03            Cart Page                 Khách hàng đã Login              Xem máy cần thuê, chỉnh ngày bắt đầu/trả
  SCR_04            Admin Dashboard           Admin                            Overview tổng đơn, chart doanh thu
  SCR_05            Admin Rentals             Admin                            Bảng quản lý đơn hàng theo trạng thái
  ----------------- ------------------------- -------------------------------- -------------------------------------------

## 2.2.3 Screenshot giao diện

*(Sinh viên tự chèn bổ sung các hình ảnh screenshot cho Client & Admin Dashboard vào phần này)*

# 2.3. THIẾT KẾ CƠ SỞ DỮ LIỆU

## 2.3.4 Quy tắc dữ liệu quan trọng

-   **Stock Tracking:** Trong giỏ hàng (`CART`), hệ thống chưa trừ `stock` để tránh phá hoại (chiếm dụng kho hàng rác). `Stock` chỉ trừ khi Admin nhấn duyệt đơn chốt thành công (`APPROVED`).
-   **Rental States:** Một giỏ hàng thực chất là một record bảng `rentals` có trạng thái là `CART`. Khi checkout, hệ thống chỉ việc đổi từ `CART` sang `PENDING`.
-   **Tự động ẩn:** Khi Admin duyệt đơn, nếu `stock` trừ xuống 0, hệ thống tự động đổi `status` của máy thành `INACTIVE` để ẩn người dùng mới không thể đặt tiếp. Quá trình trả đồ phục hồi `stock > 0` sẽ mở lại thành `ACTIVE` tự động.
-   **Lịch sử phạt/Transaction:** Quá trình phạt ghi log chi tiết chia làm 2 bảng: `RentalIssues` (Biên bản sự cố - hư hỏng, trễ hạn) và biểu thị bằng tiền tệ ở `Transactions`.

# 2.4. THIẾT KẾ XỬ LÝ & CẤU TRÚC SOURCE 

## 2.4.1 Kiến trúc thư mục & quy ước code

- Hệ thống phân chia thành 2 thư mục gốc: `frontend` và `backend`.
- **Backend (Laravel 11)**: Sử dụng pattern Service/Repository mỏng. Controller bám vào chuẩn RESTful API, trả về cấu trúc thống nhất qua class `ApiResponse.php`. Thư mục: `app/Http/Controllers`, `app/Models`, `app/Services/Rental`, `database/migrations`.
- **Frontend (React)**: Tổ chức kiểu component-based. `/src/pages` đại diện cho React Router, `/src/components` cho các layout chung, `/src/services` cho Axios API wrapper (liên kết backend). 
- Code convention: PHP PSR-12 cho Backend, ESLint + Prettier + TypeScript React cho Frontend.

## 2.4.3 Các truy vấn SQL tiêu biểu (thông qua Eloquent)

1. Phân trang sản phẩm: `Product::with(['brand', 'category'])->where('status', 'ACTIVE')->paginate(10);`
2. Truy vấn đơn hàng của User: `Rental::where('user_id', $userId)->where('status', '!=', 'CART')->orderBy('created_at', 'desc')->get();`
3. Lấy dữ liệu Giỏ hàng ngầm: `Rental::where('user_id', $user->id)->where('status', 'CART')->first();`
4. Truy vấn Dashboard Thống kê Biểu đồ (Nhóm theo tháng): `Rental::selectRaw("DATE_FORMAT(created_at, '%b %Y') as month, SUM(total_price) as revenue")...`

# CHƯƠNG 3. CÀI ĐẶT -- TRIỂN KHAI -- KIỂM THỬ

## 3.1 Môi trường phát triển & triển khai

-   Local Environment: Linux / macOS / Windows WSL.
-   Backend: PHP 8.2+, Laravel 11.0, DB MySQL 8, port mặc định localhost:8000.
-   Frontend: Node.js v20+, Vite Server port 5173. Cài đặt các gói phụ thuộc qua npm. 

## 3.2 Hướng dẫn cài đặt/chạy để chấm điểm

- **Khởi chạy Backend:**
  1. `cd backend`
  2. `cp .env.example .env` (và thiết lập thông tin liên kết MySQL, ví dụ db: `web2`, user: `web2_user`).
  3. Bật MySQL, chuẩn bị cơ sở dữ liệu.
  4. Chạy `composer install`
  5. Cài đặt CSDL và nhập dữ liệu mẫu: `php artisan migrate:fresh --seed`
  6. Khởi chạy: `php artisan serve` (Chạy tại http://localhost:8000)

- **Khởi chạy Frontend:**
  1. `cd frontend`
  2. `npm install`
  3. `npm run dev` (Chạy tại http://localhost:5173)

- **Tài khoản test (DB đã seed mồi tự động):**
  - Quản trị (Admin): `admin@rentgear.vn` / `password123`
  - Khách (User): `customer1@gmail.com` / `password123`
  - URL gốc truy cập Web khách: http://localhost:5173
  - URL riêng truy cập Admin: http://localhost:5173/admin

## 3.3 Test cases trọng điểm đã được tự động hóa

  ----------- ----------- ---------------- ----------- ------------- ------------
  TC          Chức năng   Bước thực hiện   Dữ liệu     KQ mong đợi   KQ thực tế
  TC01        Đăng nhập   Truyền sai pass  admin/123   Trả mã 401    Pass ✅
  TC02        Cart Auth   Thêm giỏ hg (Ẩn) Không có    Trả mã 401    Pass ✅
  TC03        Add Cart    Nhấn thêm đồ     token+id    Status 200    Pass ✅
  TC04        Over Stock  Checkout SL > 20 Quantity 30 Trả mã 422    Pass ✅
  TC05        Date set    Cập nhật Return  Ngày q.khứ  Lỗi 422       Pass ✅
  TC06        Status Bug  Admin duyệt sai  PEND->COMPL Lỗi 422       Pass ✅
  TC07        Status      Admin duyệt đúng PEND->APPROVThống kê kho  Pass ✅
  TC08        Auth Check  Admin URL vào Q.lýCustomer ID  Lỗi 401/403 Pass ✅
  ----------- ----------- ---------------- ----------- ------------- ------------

*(Tất cả APIs Endpoints đã được xây dựng lệnh shell automated testing để kiểm chứng Status Code HTTP, Pass 30/30 Test Suite).*

# KẾT LUẬN & HƯỚNG PHÁT TRIỂN

## Kết quả đạt được

Đồ án đã hoàn thành xuyên suốt các tính năng lõi (Core Business Flow) theo đúng vòng đời dịch vụ thuê thiết bị điện tử. Về phía End-user, khách hàng đã có trải nghiệm trơn tru từ khâu chọn thiết bị vào giỏ, thiết lập thời gian hợp đồng và theo dõi được tiến trình đơn hàng. Về phía Admin, đã trang bị đầy đủ công cụ phục vụ xử lý luồng PENDING -> APPROVED -> PICKED UP tới khâu quản lý máy hỏng (Damage) và trả kho (Return Order), bảo toàn thuật toán cộng trừ số lượng thiết bị Stock thông minh tránh sai sót số liệu.
Các xử lý lỗi (Exception handling), chặn Route giao diện phía React Router cũng đã được cấu hình toàn vẹn.  

## Hạn chế

- Do đồ án làm trong thời gian ấn định nên chưa hỗ trợ giao diện Responsive cực kỳ trau chuốt cho Mobile, mới chỉ ở tầm trung bình khá ở mức lưới.
- Mô hình trừ số lượng khi duyệt bị một vấn đề lock tài nguyên nếu hệ thống quá tải (chưa hỗ trợ Row-locking database).

## Hướng phát triển

- Tích hợp cổng trực tiếp VNPay/MoMo để giữ cọc điện tử thay vì quy trình tiền quy ước thủ công.
- Tích hợp module Realtime Socket.IO để báo cho EndUser Notification mỗi khi Admin bấm "Duyệt đơn".
- Nâng cấp tính năng cho thuê COMBO ưu đãi giảm giá bên cạnh thuê PRODUCT đơn lẻ. 

# PHỤ LỤC

- Cấu trúc thư mục lõi Backend: App/Models (15 tables), App/Http/Controllers (20 controllers).
- Cấu trúc thư mục lõi Frontend: /src/pages (20 Views Screens React).
- Hình ảnh đính kèm (Sinh viên tự gắn vào file Word khi in). 

-- Hết báo cáo --
