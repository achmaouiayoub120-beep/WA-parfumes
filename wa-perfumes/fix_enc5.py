import sys

path = r'c:\Users\ayoub\OneDrive\Bureau\WA-parfun\wa-perfumes\components\sections\PackDiscoverySection.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Une v\ufffdritable \ufffdcriture de soi. Fa\ufffdonnez une identit\ufffd olfactive unique', 'Une véritable écriture de soi. Façonnez une identité olfactive unique')
content = content.replace('Un coffret luxueux con\ufffdu pour r\ufffdv\ufffdler les multiples facettes de votre personnalit\ufffd', 'Un coffret luxueux conçu pour révéler les multiples facettes de votre personnalité')
content = content.replace('L\'\ufffdcrin', 'L\'Écrin')
content = content.replace('S\ufffdlectionnez vos formats', 'Sélectionnez vos formats')
content = content.replace('T\ufffdte</span>', 'Tête</span>')
content = content.replace('C\ufffdur</span>', 'Cœur</span>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
