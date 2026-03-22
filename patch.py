import sys
sys.stdout.reconfigure(encoding='utf-8')

c = open('src/App.jsx', encoding='utf-8').read()

faq_block = """
const faqs = [
  {
    q: 'Tôi chưa có hình ảnh cá nhân chuyên nghiệp thì sao?',
    a: 'GIAPTECH sẽ tư vấn concept chụp ảnh phù hợp với ngành nghề của bạn. Trong thời gian bạn chuẩn bị, chúng tôi có thể sử dụng kho ảnh minh họa cao cấp có bản quyền để thiết kế trước cấu trúc và luồng trải nghiệm.'
  },
  {
    q: 'Sau khi bàn giao, tôi có phải đóng thêm phí duy trì không?',
    a: 'Với gói Khởi nghiệp, bạn tự quản lý hosting/tên miền. Với gói Chuyên nghiệp và Thương hiệu, GIAPTECH đã tài trợ năm đầu tiên. Từ năm thứ 2 trở đi, chi phí gia hạn theo giá gốc nhà cung cấp (chỉ khoảng vài trăm nghìn/năm).'
  },
  {
    q: 'Tôi có thể tự thay đổi nội dung, hình ảnh sau này không?',
    a: 'Hoàn toàn được. Sau khi Go-live, chúng tôi bàn giao bộ video hướng dẫn chi tiết cách tự thay chữ, đổi ảnh rất trực quan — bạn không cần biết lập trình vẫn thao tác dễ dàng.'
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  )
}
"""

# Insert before export default
marker = '\nexport default function App()'
c = c.replace(marker, faq_block + marker, 1)

# Add FAQ section between services and pricing
faq_section = """
      {/* FAQ */}
      <Section id="faq" className="faq-section">
        <div className="container">
          <div className="section-label">Giải Đáp Thắc Mắc</div>
          <h2 className="section-title">Những Câu Hỏi Thường Gặp Trước Khi<br /><span className="gradient-text">Khởi Tạo Thương Hiệu</span></h2>
          <div className="faq-list">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </Section>

"""

c = c.replace('      {/* PRICING */}', faq_section + '      {/* PRICING */}', 1)

# Add scarcity banner inside pricing section, after pricing-note
scarcity = """
          <div className="scarcity-banner">
            <span className="scarcity-fire">🔥</span>
            <p><strong>Lưu ý:</strong> Để đảm bảo chất lượng cá nhân hóa cao nhất, GIAPTECH chỉ nhận tối đa <strong>05 dự án/tháng</strong>.<br /><span className="scarcity-urgent">Cập nhật: Tháng này chỉ còn 02 vị trí trống.</span></p>
          </div>
"""

c = c.replace('          <div className="pricing-grid">', scarcity + '          <div className="pricing-grid">', 1)

# Add mobile action bar before closing </div> of app (before footer scroll-top)
mobile_bar = """
      {/* MOBILE ACTION BAR */}
      <div className="mobile-action-bar">
        <a href="tel:0352425290" className="mob-btn mob-btn-outline">
          <span>📞</span> Gọi Ngay
        </a>
        <a href="https://zalo.me/0352425290" target="_blank" rel="noreferrer" className="mob-btn mob-btn-primary">
          <span>💬</span> Chat Zalo
        </a>
      </div>

"""

c = c.replace('      <button className={`scroll-top', mobile_bar + '      <button className={`scroll-top', 1)

open('src/App.jsx', 'w', encoding='utf-8').write(c)
print('done')
