import sys
sys.stdout.reconfigure(encoding='utf-8')
c = open('src/App.jsx', encoding='utf-8').read()
c = c.replace('<Counter target="50" suffix="+" />', '2.500+')
open('src/App.jsx','w',encoding='utf-8').write(c)
print('done')
