import sys
sys.stdout.reconfigure(encoding='utf-8')

c = open('src/App.jsx', encoding='utf-8').read()

# Update h1
old_h1 = (
    '              Năng lực của bạn xứng đáng được trả giá cao hơn.<br />\n'
    '              <span className="gradient-text">Đừng để khách hàng chọn đối thủ chỉ vì họ có vẻ ngoài bóng bẩy hơn.</span>'
)
new_h1 = (
    '              Tôn vinh thực tài —<br />\n'
    '              <span className="gradient-text">Nâng tầm vị thế</span>'
)
c = c.replace(old_h1, new_h1)

# Update hero-desc — find by class and replace inner text
old_desc = 'Khách hàng không thể trực tiếp trải nghiệm chuyên môn của bạn qua màn hình, họ đánh giá qua sự chuyên nghiệp. Đừng tuột mất khách hàng VIP vào tay đối thủ chỉ vì bề ngoài số hóa của họ bóng bẩy hơn.'
# Check what's currently in hero-desc
import re
m = re.search(r'<p className="hero-desc">(.*?)</p>', c, re.DOTALL)
if m:
    print("FOUND hero-desc:", repr(m.group(1)[:80]))
    c = c.replace(m.group(1), '\n              ' + old_desc + '\n            ')

open('src/App.jsx', 'w', encoding='utf-8').write(c)
print('done')
