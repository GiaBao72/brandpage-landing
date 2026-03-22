import sys
sys.stdout.reconfigure(encoding='utf-8')
c = open('src/App.css', encoding='utf-8').read()
c = c.replace('  .scroll-top{display:none}\n', '')
open('src/App.css','w',encoding='utf-8').write(c)
print('done')
