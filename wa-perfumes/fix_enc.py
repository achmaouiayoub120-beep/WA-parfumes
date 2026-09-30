import sys, re

path = r'c:\Users\ayoub\OneDrive\Bureau\WA-parfun\wa-perfumes\components\sections\PackDiscoverySection.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Slectionnez', 'Sélectionnez')
content = content.replace('vritable', 'véritable')
content = content.replace('criture', 'écriture')
content = content.replace('Faonnez', 'Façonnez')
content = content.replace('identit', 'identité')
content = content.replace('L''crin', 'L''Écrin')
content = content.replace('conu', 'conçu')
content = content.replace('rvler', 'révéler')
content = content.replace('TǦte', 'Tête')
content = content.replace('C"ur', 'Cœur')
content = content.replace('Dcouverte', 'Découverte')
content = content.replace('slection', 'sélection')
content = content.replace('cration', 'création')
content = content.replace('dtaille', 'détaillée')
content = content.replace('prciser', 'préciser')
content = content.replace('numro', 'numéro')
content = content.replace('tlphone', 'téléphone')
content = content.replace('ressayer', 'réessayer')
content = content.replace(' la livraison', 'à la livraison')
content = content.replace('Commander ?" 199 DH', 'Commander — 199 DH')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
