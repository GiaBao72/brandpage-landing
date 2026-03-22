# logs/brandpage-landing.md

## 2026-03-22 — STABLE CHECKPOINT v1.0

**Git tag:** `v1.0-stable` (commit `88e62d6`)
**Live:** https://giaptech.site
**Repo:** https://github.com/GiaBao72/brandpage-landing

---

### Cấu trúc dự án

- **Stack:** Vite + React (không Next.js)
- **Deploy:** GitHub Pages via Actions (push main → auto deploy)
- **Branch:** `main` = production | `dev` = staging
- **Rule:** CHỈ push `main` khi Nhà Vua nói rõ "đẩy lên domain / push main / deploy". TUYỆT ĐỐI không tự ý push main dù có lý do gì. Mặc định chỉ push dev.

---

### Sections (theo thứ tự)

1. **Navbar** — fixed top, blur glass, hamburger mobile, logo click scroll top
2. **Hero** — particles canvas, orb bg, 2-col grid (content + mockup), badge + h1 + desc + CTA + stats
3. **Benefits** — 6 card TiltCard 3D hover
4. **Features** — 5 card TiltCard
5. **Process** — 5 bước timeline dọc
6. **Services** — 6 card ngành nghề
7. **Portfolio/Demos** — filter theo category, 37 demo cards với Unsplash image
8. **FAQ** — accordion 3 câu hỏi (click mở/đóng)
9. **Pricing** — 3 gói + scarcity banner 🔥
10. **Contact** — 2 cột: liên hệ trực tiếp (📞 Gọi + 💬 Zalo + 💙 Messenger) + form
11. **Footer** — navy bg
12. **Scroll-top button** — fixed, hiện khi scroll > 500px
13. **Mobile Action Bar** — fixed bottom, "Gửi Thông Tin" + Chat Zalo (chỉ mobile)
14. **Messenger Bubble** — fixed bottom right, xanh Messenger

---

### Nội dung chính

- **Hero H1:** "Tôn vinh thực tài — Nâng tầm vị thế" (gradient)
- **Hero desc:** Khách hàng đánh giá qua sự chuyên nghiệp...
- **Stats:** 2.500+ / 98% / <2s / 24/7
- **Phone/Zalo:** 0352 425 290
- **Messenger Page ID:** 583549081512783
- **Email nhận lead:** vuonggiabao.7297@gmail.com
- **Domain:** giaptech.site

---

### Design Tokens

```
--b500: #3b82f6 (primary blue)
--b600: #2563eb
--b700: #1d4ed8
--navy: #0f172a
Font: Google Sans Flex (variable font, weight 100-900)
Border-radius: 16px
```

---

### Components đặc biệt

- `TiltCard` — 3D tilt on hover (perspective 600px), support `target` prop
- `RippleBtn` — ripple effect on click, support `target="_blank"` prop
- `Counter` — animated số khi scroll vào view
- `Particles` — canvas background hero
- `FAQItem` — accordion state (useState open/close)
- `Section` — IntersectionObserver reveal animation

---

### Section Portfolio/Demos

- **Dữ liệu:** mảng `premiumDemos` (37 items)
- **Categories:** PT / Yoga (7), Bất động sản (8), Ô tô (4), Tài chính (6), Spa / Thẩm mỹ (5), Giáo dục (7)
- **Filter "Tất cả":** chỉ hiện 1 card đại diện mỗi category
- **Ảnh:** Unsplash (đã thử thum.io và microlink.io nhưng không ổn định)
- **Link demo:** mở tab mới (`target="_blank"`)
- **Biến filter:** `activeTab`, `visibleDemos`

---

### Form liên hệ (Formsubmit.co)

- **Endpoint:** `https://formsubmit.co/ajax/vuonggiabao.7297@gmail.com`
- **Method:** POST JSON (AJAX, không redirect)
- **Fields:** name, phone, linh_vuc (lĩnh vực chuyên môn), service, message
- **Subject:** "Lead moi tu GIAPTECH.SITE"
- **Template:** table
- **Lần đầu:** cần activate qua email xác nhận từ Formsubmit
- **UX:** submit xong hiện "🎉 Đã nhận thông tin" ngay, không reload trang

---

### Rebuild từ đầu nếu cần

Để rebuild về trạng thái này:
```
git checkout v1.0-stable
npm install
npm run build
```
Hoặc rollback:
```
git reset --hard 88e62d6
```

---

### Lịch sử commit chính

| Commit | Mô tả |
|--------|-------|
| a3bd99f | fix: remove replaceState - keep URL natural |
| 0711665 | fix: messenger bubble position mobile 8rem |
| 15684d3 | feat: add Messenger contact method in contact section |
| c8b9fac | feat: add Messenger chat bubble fixed bottom right |
| 0522eae | fix: scroll to contact-form element directly on mobile CTA |
| d37547b | feat: mobile action bar - replace call btn with scroll to contact form |
| 71ba2b0 | fix: hide anchor hash from URL on nav click |
| 36a0d0a | fix: update name placeholder text |
| 96d3091 | fix: include linh_vuc field in Formsubmit payload |
| 502a8c4 | feat: integrate Formsubmit.co for contact form |
| fd4dda9 | fix: update images for Examin Academy and MBA cards |
| 22a7722 | feat: add 7 education demo links |
| b90075c | feat: add 5 spa/beauty demo links |
| dbdec21 | feat: add 6 finance demo links |
| 31d5470 | feat: add 4 car demo links + Ô tô tab |
| d4103fb | fix: switch back to Unsplash images for portfolio cards |
| 80e8ebb | feat: Tat Ca tab shows 1 card per category only |
| 21eb837 | feat: add 8 BDS demo links |
| 8158180 | feat: fill fitness links - 7 PT/Yoga demos |
| 7b6a582 | fix: portfolio links open in new tab |
| e723b04 | feat: use thum.io live screenshots (sau đổi lại Unsplash) |
| 34ed66c | feat: logo and Trang Chu nav link scroll to top |
| bc22dc6 | feat: portfolio masonry layout |
| 88e62d6 | fix: scroll-top above mobile action bar (v1.0-stable) |

---

### Bài học / Lỗi đã gặp

#### 1. Screenshot tự động không ổn định
- **thum.io**: trả về GIF loading placeholder, không dùng làm static image được
- **microlink.io**: free tier không support `waitFor`, ảnh chụp lúc preloader chưa biến mất
- **screenshotapi.net**: cần API key, không free
- ✅ **Giải pháp**: dùng Unsplash với keyword phù hợp chủ đề — đẹp hơn, ổn định hơn

#### 2. Push nhầm main
- Chó nhiều lần tự push `main` dù Nhà Vua chưa cho phép
- **Rule cứng**: CHỈ push `dev` mặc định. Push `main` khi nghe "push main / deploy / đẩy lên domain"

#### 3. Font Google Sans Flex
- Đổi từ `Be Vietnam Pro` → `Google Sans Flex` (variable font)
- Import: `https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@100..900&display=swap`
- CSS: `font-family: 'Google Sans Flex', system-ui, sans-serif`

#### 4. replaceState xóa hash URL
- Thử dùng `history.replaceState` để ẩn `#contact` khỏi URL
- Gây bug: scroll không đến đích vì replaceState chạy trước scrollIntoView
- Fix tạm: setTimeout 800ms → vẫn không ổn trên mobile
- ✅ **Giải pháp cuối**: bỏ hết replaceState, để URL tự nhiên

#### 5. RippleBtn cần target prop
- Ban đầu không có `target` prop → link demo không mở tab mới
- Fix: thêm `target` vào function signature và truyền vào thẻ `<a>`

#### 6. dev branch out-of-sync
- Sau nhiều lần push main trực tiếp, dev bị lag phía sau
- Fix: `git push origin main:dev --force`

---

### Trạng thái hiện tại (2026-03-23)

✅ Live trên giaptech.site (commit a3bd99f)
✅ Section Portfolio với 37 demo, filter đầy đủ
✅ Form liên hệ tích hợp Formsubmit.co
✅ Messenger bubble + contact method
✅ Mobile action bar: "Gửi Thông Tin" + "Chat Zalo"
✅ Font Google Sans Flex
✅ Backup XML: `brandpage-landing-ver1.0.xml` (workspace root)
