import sys

path = r'c:\Users\ayoub\OneDrive\Bureau\WA-parfun\wa-perfumes\components\sections\PackDiscoverySection.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace block 1
block1 = '''                  <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--color-text)] mb-3">Rituel Sur-Mesure</h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Une véritable écriture de soi. Façonnez une identité olfactive unique.
                  </p>'''
import re
content = re.sub(r'                  <h4 className="text-xs md:text-sm uppercase tracking-\[0\.2em\] text-\[var\(--color-text\)\] mb-3">Rituel Sur-Mesure</h4>\s+<p className="text-sm text-\[var\(--color-text-muted\)\] leading-relaxed">.*?</p>', block1, content, flags=re.DOTALL)


# Replace block 2
block2 = '''                  <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--color-text)] mb-3">L'Écrin Absolu</h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Un coffret luxueux conçu pour révéler les multiples facettes de votre personnalité.
                  </p>'''
content = re.sub(r'                  <h4 className="text-xs md:text-sm uppercase tracking-\[0\.2em\] text-\[var\(--color-text\)\] mb-3">L.*?crin Absolu</h4>\s+<p className="text-sm text-\[var\(--color-text-muted\)\] leading-relaxed">.*?</p>', block2, content, flags=re.DOTALL)

# Replace block 3 (Notes)
content = re.sub(r'<span className="text-\[var\(--color-text-muted\)\] text-xs block mb-1">T.*?te</span>', '<span className="text-[var(--color-text-muted)] text-xs block mb-1">Tête</span>', content)
content = re.sub(r'<span className="text-\[var\(--color-text-muted\)\] text-xs block mb-1">C.*?ur</span>', '<span className="text-[var(--color-text-muted)] text-xs block mb-1">Cœur</span>', content)

# Replace Title
content = re.sub(r'S.*?lectionnez vos formats', 'Sélectionnez vos formats', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
