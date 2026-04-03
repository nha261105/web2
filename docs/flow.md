# Business Flows

Hệ thống Quản lý Cho Thuê Thiết Bị xoay quanh các vòng lặp nghiệp vụ sau:

## 1. Flow Xác thực (Authentication)
- Khách hàng (User) tạo tài khoản/đăng nhập qua Backend (JWT Authentication auth.token).
- Mật khẩu được tự động băm thông qua Accessor (`hash_password` của User Model).
- Đăng nhập thành công trả về AccessToken, được lưu phía Storage Frontend. Giao diện đổi Navbar sang trạng thái đã đăng nhập. Nếu truy cập các Routes nhạy cảm (`/checkout`, `/account`) lúc chưa có token, Frontend sẽ tự động đẩy người dùng về Log in kèm query `?redirect`.

## 2. Flow Giỏ Hàng & Checkout (Renting Flow)
1. **Shopping**: User dạo xem Sản phẩm (`Product`) hoặc `Combo`. Quyết định ấn "Thêm vào giỏ".
2. **Add to Cart**: Gửi request `POST /api/cart`. Backend lúc này sẽ tạo 1 bản ghi `rentals` với `status = 'CART'` (nếu chưa có). Sản phẩm trở thành `rental_details`.
3. **Cart Customization**: Tại trang Giỏ hàng, User có thể chọn ngày muốn thuê/trả (`PATCH /api/cart/return-date`), thay đổi số lượng thiết bị (`PATCH /api/cart/items/{id}`).
4. **Checkout**: Khi bấm "Thanh toán", Frontend gửi `POST /api/cart/checkout`. 
   - Backend tính tổng số ngày x \`price_at_rental\` -> `total_price`.
   - Tính tổng tiền cọc thiết bị -> `deposit_amount`.
   - Lưu địa chỉ giao (*address_id*) và ghi đè trạng thái giỏ hàng từ `CART` sang `PENDING`.
   - Một mã code ngẫu nhiên như `RNT...` được tự động sinh.

## 3. Flow Xét Duyệt & Vận hành (Admin Flow)
1. Đơn `PENDING` sẽ xuất hiện trên Admin Dashboard.
2. Admin kiểm tra kho, nếu ok tiến hành gọi API `PATCH /api/rentals/{id}` đổi trạng thái thành `APPROVED` -> `READY_FOR_PICKUP` -> `PICKED_UP`.
3. Thông qua mỗi trạng thái duyệt hợp lệ, Admin có thể sinh tay Transaction (nhận cọc) để quản lý luồng tiền. User có thể vào trang "Đơn hàng của tôi" để xem trạng thái thời gian thực.

## 4. Flow Trả Hàng & Tính Phạt (Return & Penalty Flow)
1. Tới ngày cuối hợp đồng (`end_date`), user đến trả đồ. 
2. Admin mở phần mềm gửi request **Return Order** (`POST /api/return-orders`). 
   - Truyền danh sách `items` kèm tình trạng `condition => GOOD/DAMAGED/LOST` của riêng thiết bị đó.
3. Backend Service `ReturnOrderFallbackService` vào việc:
   - Tính toán xem lúc trả kho có trễ hơn `end_date` không. Nếu trễ, tự động sinh biên phí trễ với giá `late_day_fee` của thiết bị đó.
   - Nếu `condition != GOOD`, ghi nhận hư hại và thu thập lệ phí đền bù (có thể từ cọc).
   - Tự động sinh ticket `RentalIssue` để báo cáo tình huống.
   - Sinh biên lai trừ tiền/báo nhận cọc `Transaction`.
4. Nếu tất cả các thiết bị trong đơn được trả lại, Backend tự động đổi trạng thái `rentals` mốc sang `COMPLETED`. 
5. Lúc này hoàn kết luồng Thuê & Trả. Mọi giao dịch khép lại.

---

## 5. Hướng dẫn Kiểm thử (Testing Scenarios)

Để đảm bảo hệ thống hoạt động chính xác ở "mọi ngóc ngách" theo đúng Business Logic trên, bạn có thể thực hiện tuần tự các bài Test sau:

### Kịch bản 1: Luồng Giới hạn (Unauthenticated & Stock)
- **Cố tình thêm Giỏ khi chưa Đăng nhập**: Tại trang chủ/sản phẩm (Mở tab Ẩn danh), nhấn "Thêm vào giỏ" -> **Kỳ vọng**: Văng Toast báo lỗi và bị đá về màn `/signin`.
- **Thử bạo lực Tồn kho**: Đăng nhập lại, vào Sản phẩm có số lượng = X. Thử chọn số lượng thuê = X + 1 hoặc nhấn "+" liên tục. -> **Kỳ vọng**: Bị vô hiệu hóa nút "+" hoặc khi gọi API sẽ báo lỗi văng "Not enough stock" (Thiếu hàng).
- **Test giỏ hàng Real-time**: Thêm 2 món vào giỏ. Mở 2 tab trang `Cart` cạnh nhau. Tab một xóa sản phẩm A -> sang Tab 2 F5 lại -> Sản phẩm A phải biến mất và tổng tiền tính lại.

### Kịch bản 2: Luồng Checkout - Sinh Đơn (End-To-End 1)
- Tạo đơn cho 1 `Product` (3 ngày) và 1 `Product` khác (5 ngày). Tại màn trang `Cart`, đổi số ngày sang 7. -> **Kỳ vọng**: Frontend nhảy số tổng tiền lập tức.
- Bấm Thanh toán -> Điền/Chọn Địa chỉ mới tinh, nhập Note "Giao lúc 5h" -> Chọn OK.
- Chuyển vào _Đơn hàng của tôi_ -> **Kỳ vọng**: Đơn hàng nằm ở Trạng thái `PENDING`, tiền thuê = `Tổng giá ngày * 7` và tiền cọc có giá trị đúng. Ở trang xem User ở ngoài Cửa hàng, Stock (số lượng) của sản phẩm VẪN CHƯA BỊ TRỪ.

### Kịch bản 3: Luồng Admin Xét duyệt & Stock Control
- Truy cập bằng tài khoản `admin@rentgear.vn` (`password123`).
- Vào màn Quản lý Đơn (Admin Rentals), mở cái Đơn vừa lập.
- **Duyệt đơn**: Chuyển trạng thái từ `PENDING` thành `APPROVED` (chú ý: tại lúc này, Backend chính thức gọt trừ rớt số lượng `available` trong bảng `Products`). 
- Hãy sang trang Client kiểm tra -> Món đồ lúc nãy sẽ báo hụt đi số lượng. Nếu `available = 0`, nút "Thêm vào giỏ" sẽ bị Block mờ đi!
- Khi khách đến xách đồ đi -> cập nhật thành `PICKED_UP`.

### Kịch bản 4: Trả Hàng - Happy Case & Penalty Case
_Hệ thống hỗ trợ việc máy trả thành từng đợt (nếu đơn có nhiều món). Bạn sử dụng công cụ như Postman để trigger route Return._

Thử API `POST /api/return-orders` payload (truyền ID tương ứng và token Admin):
```json
{
  "rental_id": [ID_DON_HANG],
  "items": [
     { "rental_detail_id": [ID_Detail_SanPham_1], "return_condition": "GOOD" }
  ]
}
```
- **Happy Case**: Trả thiết bị 1 bình thường trước hạn (`GOOD`). -> **Kỳ vọng**: Tồn kho sản phẩm 1 được `+` trả lại như cũ. Đơn vẫn còn thiết bị 2 nên chưa `COMPLETED`.
- **Damaged Case**: Hôm sau trả thiết bị 2, nhưng gửi payload báo `return_condition: "DAMAGED"` hoặc `"LOST"`.
-> **Kỳ vọng**: 
    - Tồn kho của đồ vật KHÔNG được cộng lại (Báo hỏng kho).
    - Database sinh tự động 1 thẻ ở bảng `RentalIssues` bắt bạn đền tiền `repair_fee`.
- **Late Penalty Case**: Cố tình sử dụng DB GUI (như TablePlus) sửa cột `end_date` của Đơn hàng dời về 5 ngày trước trong quá khứ. Sau đó lấy Postman gọi trả nốt món còn lại. -> **Kỳ vọng**: Backend tự động phạt tiền trễ (`late_fee`) nhân với (5 ngày) x tiền thuê hằng ngày. 

### Kịch bản 5: Dashboard Báo Cáo Thực Tế
- Sau khi trải qua hết vòng lặp Khách Đặt -> Admin Duyệt -> Khách Trả.
- Vào trang **Admin Dashboard** & **Reports**. -> **Kỳ vọng**: Doanh thu tổng (Total Revenue) nhảy số; Cột doanh thu tháng hiện tại vút lên.
- Vào trang **Admin Users**. -> **Kỳ vọng**: Acc khách hàng đó tăng `Order` lên 1, và `Total Spent` khớp với giá hóa đơn lúc nãy.
