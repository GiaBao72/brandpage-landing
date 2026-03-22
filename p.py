import sys
sys.stdout.reconfigure(encoding='utf-8')
c = open('src/App.jsx', encoding='utf-8').read()
c = c.replace('<strong><Counter target="98" suffix="%" /></strong>', '<strong>98%</strong>')
open('src/App.jsx','w',encoding='utf-8').write(c)
print('done')
