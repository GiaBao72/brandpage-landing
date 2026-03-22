import sys
sys.stdout.reconfigure(encoding='utf-8')
c = open('src/App.css', encoding='utf-8').read()

# Fix scroll-top: raise above mobile action bar on mobile
old = '@media(max-width:768px){\n  .mobile-action-bar{display:flex}\n  body{padding-bottom:85px}\n}'
new = '@media(max-width:768px){\n  .mobile-action-bar{display:flex}\n  body{padding-bottom:85px}\n  .scroll-top{bottom:6rem;z-index:1000}\n}'
c = c.replace(old, new)

open('src/App.css','w',encoding='utf-8').write(c)
print('done')
