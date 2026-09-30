import sys

path = r'c:\Users\ayoub\OneDrive\Bureau\WA-parfun\wa-perfumes\components\sections\PackDiscoverySection.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('S?lectionnez vos formats', 'Sélectionnez vos formats')
content = content.replace('Une vǸritable Ǹcriture de soi. Faonnez une identitǸ olfactive unique.', 'Une véritable écriture de soi. Façonnez une identité olfactive unique.')
content = content.replace('L''?crin Absolu', 'L''Écrin Absolu')
content = content.replace('Un coffret luxueux conu pour rǸvǸler les multiples facettes de votre personnalitǸ.', 'Un coffret luxueux conçu pour révéler les multiples facettes de votre personnalité.')
content = content.replace('TǦte', 'Tête')
content = content.replace('C"ur', 'Cœur')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
