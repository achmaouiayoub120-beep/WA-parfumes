import sys, re

path = r'c:\Users\ayoub\OneDrive\Bureau\WA-parfun\wa-perfumes\components\sections\PackDiscoverySection.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'S.*?lectionnez vos formats', 'Sélectionnez vos formats', content)
content = re.sub(r'Une v.*?ritable .*?criture de soi\. Fa.*?onnez une identit.*? olfactive unique\.', 'Une véritable écriture de soi. Façonnez une identité olfactive unique.', content)
content = re.sub(r'L''.*?crin Absolu', 'L''Écrin Absolu', content)
content = re.sub(r'Un coffret luxueux con.*?u pour r.*?v.*?ler les multiples facettes de votre personnalit.*?\.', 'Un coffret luxueux conçu pour révéler les multiples facettes de votre personnalité.', content)
content = re.sub(r'T.*?te', 'Tête', content)
content = re.sub(r'C.*?ur', 'Cœur', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
