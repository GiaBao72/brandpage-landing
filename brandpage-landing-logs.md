# logs/brandpage-landing.md

## 2026-03-23 — UPDATED CHECKPOINT (post v1.0)

**Latest commit:** `90fe58c`
**Live:** https://giaptech.site
**Repo:** https://github.com/GiaBao72/brandpage-landing

---

### Cấu trúc dự án

- **Stack:** Vite + React 19 (không Next.js)
- **Deploy:** GitHub Pages via Actions (push main → auto deploy)
- **Branch:** `main` = production | `dev` = staging
- **Rule:** CHỈ push `main` khi Nhà Vua nói rõ "push main / deploy / quất". TUYỆT ĐỐI không tự ý push main.

---

### Sections (theo thứ tự)

1. **Navbar** — fixed top, blur glass, hamburger mobile, logo click scroll top
2. **Hero** — particles canvas, orb bg, 2-col grid, badge + h1 + desc + CTA + stats
3. **Benefits** — 6 card TiltCard 3D hover
4. **Features** — 5 card TiltCard
5. **Process** — 5 bước timeline dọc
6. **Services** — 6 card ngành nghề
7. **Portfolio/Demos** — filter theo category, 37 demo cards
8. **FAQ** — accordion 3 câu hỏi
9. **Pricing** — 3 gói + scarcity banner 🔥
10. **Contact** — 2 cột: liên hệ (📞 Gọi + 💬 Zalo + 💙 Messenger) + form
11. **Footer** — navy bg, Logo-footer.png, slogan, links
12. **Scroll-top button** — fixed, hiện khi scroll > 500px
13. **Mobile Action Bar** — fixed bottom, "Gửi Thông Tin" + Chat Zalo
14. **Messenger Bubble** — fixed bottom right, xanh Messenger

---

### Nội dung chính

- **Hero H1:** "Tôn vinh thực tài — Nâng tầm vị thế" (gradient)
- **Stats:** 2.500+ / 98% / <2s / 24/7
- **Phone/Zalo:** 0352 425 290
- **Messenger Page ID:** 583549081512783
- **FB Page:** https://www.facebook.com/giaptech
- **FB App ID:** 647547958176308
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

### Assets

- `public/Logo.png` — logo navbar (52px desktop, 32px mobile)
- `public/Logo-footer.png` — logo footer (64px, màu gốc)
- `public/favicon.png` — favicon tab
- `public/Logo - metadata.png` — og:image khi share link (1200x630px)
- `public/sitemap.xml` — sitemap SEO
- `public/icons.svg` — icon set

---

### Components đặc biệt

- `TiltCard` — 3D tilt on hover (perspective 600px)
- `RippleBtn` — ripple effect on click, support `target` prop
- `Counter` — animated số khi scroll vào view
- `Particles` — canvas background hero
- `FAQItem` — accordion state (useState open/close)
- `Section` — IntersectionObserver reveal animation

---

### Section Portfolio/Demos

- **Dữ liệu:** mảng `premiumDemos` (37 items)
- **Categories:** PT / Yoga, Bất động sản, Ô tô (4), Tài chính (6), Spa / Thẩm mỹ (5), Giáo dục (7)
- **Filter "Tất cả":** hiện 1 card đại diện mỗi category
- **Ảnh:** Unsplash links
- **Link demo:** mở tab mới (`target="_blank"`)

---

### Form liên hệ (Formsubmit.co)

- **Endpoint:** `https://formsubmit.co/ajax/vuonggiabao.7297@gmail.com`
- **Method:** POST JSON (AJAX, không redirect)
- **Fields:** name, phone, linh_vuc, service, message
- **Subject:** "Lead moi tu GIAPTECH.SITE"
- **Lần đầu:** cần activate qua email xác nhận từ Formsubmit

---

### Metadata / SEO

- Title, description, keywords, canonical, robots ✅
- Open Graph (og:title, og:description, og:image, og:url) ✅
- fb:app_id: 647547958176308 ✅
- Twitter Card ✅
- Schema.org ProfessionalService ✅
- sitemap.xml tại /sitemap.xml ✅

---

### Rebuild từ đầu nếu cần

```
git clone https://github.com/GiaBao72/brandpage-landing
npm install
npm run dev
```

---

### Lịch sử commit chính

| Commit | Mô tả |
|--------|-------|
| 90fe58c | feat: add fb:app_id to meta tags |
| 70c0aeb | feat: use Logo-metadata.png for og:image |
| 60e3a87 | feat: use Logo-footer.png in footer |
| 44cc349 | fix: reduce navbar padding on mobile |
| 17761c1 | feat: footer logo image + slogan |
| 16d5a20 | feat: use favicon.png as site favicon |
| a3bd99f | fix: remove replaceState - keep URL natural |
| 0711665 | fix: messenger bubble position mobile 8rem |
| 15684d3 | feat: add Messenger contact method |
| c8b9fac | feat: add Messenger chat bubble fixed bottom right |
| 0522eae | fix: scroll to contact-form element on mobile CTA |
| 502a8c4 | feat: integrate Formsubmit.co for contact form |
| fd4dda9 | fix: update images for Examin Academy and MBA |
| 22a7722 | feat: add 7 education demo links |
| b90075c | feat: add 5 spa/beauty demo links |
| dbdec21 | feat: add 6 finance demo links |
| 31d5470 | feat: add 4 car demo links + Ô tô tab |
| 88e62d6 | v1.0-stable checkpoint |

---

### Bài học / Lỗi đã gặp

#### 1. Screenshot tự động không ổn định
- thum.io, microlink.io đều không dùng được cho static image
- ✅ Dùng Unsplash với keyword phù hợp

#### 2. Push nhầm main
- Rule cứng: chỉ push `dev` mặc định
- Push `main` khi nghe: "push main / deploy / quất / bút mên"

#### 3. PowerShell Set-Content corrupt tiếng Việt
- KHÔNG dùng `Set-Content`, `Add-Content` PowerShell cho file có tiếng Việt
- ✅ LUÔN dùng Python `open(path, 'w', encoding='utf-8').write(t)`

#### 4. replaceState xóa hash URL
- Gây bug scroll không đến đích
- ✅ Bỏ hết replaceState, để URL tự nhiên

#### 5. og:image cần URL encode
- Tên file có space: `Logo - metadata.png` → encode thành `Logo%20-%20metadata.png`

---

### Trạng thái hiện tại (2026-03-23 02:53)

✅ Live trên giaptech.site (commit 90fe58c)
✅ 37 demo cards, filter đầy đủ 6 categories
✅ Form Formsubmit.co (cần activate lần đầu)
✅ Messenger bubble + contact section
✅ Logo navbar + footer riêng biệt
✅ Favicon + OG metadata + fb:app_id
✅ Sitemap.xml
✅ Google Sans Flex font
✅ Mobile responsive hoàn chỉnh
