# logs/brandpage-landing.md

## 2026-03-23 — FINAL CHECKPOINT v1.1

**Latest commit:** `9cc2778`
**Live:** https://giaptech.site
**Repo:** https://github.com/GiaBao72/brandpage-landing

---

### Cấu trúc dự án

- **Stack:** Vite + React 19 (không Next.js)
- **Deploy:** GitHub Pages via Actions (push main → auto deploy)
- **Branch:** `main` = production | `dev` = staging
- **Rule:** CHỈ push `main` khi Nhà Vua nói "push main / deploy / quất / bút mên". TUYỆT ĐỐI không tự ý.

---

### Sections (theo thứ tự)

1. **Navbar** — fixed top, blur glass, hamburger mobile, Logo.png (52px desktop / 32px mobile)
2. **Hero** — particles canvas, orb bg, 2-col grid, badge + h1 + desc + CTA + stats
3. **Benefits** — 6 card TiltCard 3D hover
4. **Features** — 5 card TiltCard
5. **Process** — 5 bước timeline dọc
6. **Services** — 6 card ngành nghề
7. **Portfolio/Demos** — filter theo category, 37 demo cards
8. **FAQ** — accordion 3 câu hỏi
9. **Pricing** — 3 gói + scarcity banner 🔥
10. **Contact** — 2 cột: liên hệ (💬 Zalo + 💙 Messenger) + form
11. **Footer** — navy bg, Logo-footer.png, slogan, links
12. **Scroll-top button** — fixed, hiện khi scroll > 500px
13. **Mobile Action Bar** — fixed bottom, "Gửi Thông Tin" + Chat Zalo
14. **Messenger Bubble** — fixed bottom right, xanh Messenger (bottom 8rem mobile)

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
Navbar padding: 0.6rem 5% (desktop) / 0.5rem 4% (mobile)
```

---

### Assets

- `public/Logo.png` — logo navbar (52px desktop, 32px mobile)
- `public/Logo-footer.png` — logo footer (64px, màu gốc)
- `public/favicon.png` — favicon tab trình duyệt
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
- **Categories:** PT / Yoga, Bất động sản, Ô tô, Tài chính, Spa / Thẩm mỹ, Giáo dục
- **Filter "Tất cả":** hiện 1 card đại diện mỗi category
- **Ảnh:** Unsplash links (stable, đẹp)
- **Link demo:** mở tab mới (`target="_blank"`)

---

### Form liên hệ (Formsubmit.co)

- **Endpoint:** `https://formsubmit.co/ajax/vuonggiabao.7297@gmail.com`
- **Method:** POST JSON (AJAX, không redirect)
- **Fields:** name, phone, linh_vuc, service, message
- **Subject:** "Lead moi tu GIAPTECH.SITE"
- **Lần đầu:** cần activate qua email xác nhận từ Formsubmit

---

### Metadata / SEO ✅ HOÀN CHỈNH

- **Title:** Thiết kế landing page cá nhân cho huấn luyện viên, môi giới, giáo viên | GIAPTECH
- **Description:** Thiết kế landing page cá nhân chuyên nghiệp tại Việt Nam — dành cho HLV PT, yoga, giáo viên, môi giới BĐS, xe, tài chính. Tốc độ <2s, chuẩn Google Core Web Vitals. Từ 2.900.000đ — bàn giao 7–14 ngày.
- **Keywords:** thiết kế landing page cá nhân, landing page huấn luyện viên, môi giới bất động sản...
- **og:image:** https://giaptech.site/Logo%20-%20metadata.png
- **og:image:alt:** GIAPTECH — Thiết kế landing page cá nhân chuyên nghiệp
- **fb:app_id:** 647547958176308 ✅
- **Twitter Card:** summary_large_image ✅
- **Schema.org:** ProfessionalService ✅
- **sitemap.xml** ✅
- **FB Debugger:** đã verify, không còn lỗi ✅

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
| 9cc2778 | seo: update meta description keyword-rich |
| 6dfcecf | feat: add og:image:alt |
| 90fe58c | feat: add fb:app_id |
| 70c0aeb | feat: use Logo-metadata.png for og:image |
| 60e3a87 | feat: use Logo-footer.png in footer |
| 5c769ab | fix: navbar padding desktop 0.6rem |
| 44cc349 | fix: navbar padding mobile 0.5rem |
| 17761c1 | feat: footer logo + slogan |
| 16d5a20 | feat: favicon.png |
| a3bd99f | fix: remove replaceState |
| 0711665 | fix: messenger bubble mobile 8rem |
| 15684d3 | feat: Messenger contact section |
| c8b9fac | feat: Messenger bubble fixed |
| 0522eae | fix: scroll to contact-form mobile |
| 502a8c4 | feat: Formsubmit.co integration |
| 88e62d6 | v1.0-stable checkpoint |

---

### Bài học xương máu

1. **PowerShell Set-Content** → corrupt tiếng Việt → LUÔN dùng Python write
2. **Push main nhầm** → chỉ push dev mặc định, push main khi nghe "push main/quất/bút mên"
3. **Screenshot tự động** → thum.io/microlink không ổn → dùng Unsplash
4. **replaceState** → gây bug scroll → bỏ hết, để URL tự nhiên
5. **og:image space** → encode URL: `Logo%20-%20metadata.png`
6. **FB Debugger cache** → bấm "Scrape Again" 2-3 lần mới flush

---

### Trạng thái hiện tại (2026-03-23 03:00)

✅ Live giaptech.site — commit 9cc2778
✅ 37 demo cards, 6 categories filter
✅ Formsubmit.co form (cần activate lần đầu)
✅ Messenger bubble + contact section
✅ Logo navbar + footer riêng biệt
✅ Metadata SEO hoàn chỉnh — FB Debugger xanh
✅ sitemap.xml, fb:app_id, og:image, twitter:card
✅ Google Sans Flex font
✅ Mobile responsive hoàn chỉnh
