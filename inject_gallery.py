import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('real_images_gallery.html', 'r', encoding='utf-8') as f:
    gallery = f.read()

pattern = r'(<div class="gallery-medium-container" id="medium-real"[^>]*>.*?)(?=<!-- ========== 2D PLANS ========== -->|<!-- ========== PRESENTATIONS ========== -->)'

match = re.search(pattern, html, re.DOTALL)
if match:
    # replace the block
    html = html[:match.start()] + gallery + "\n  " + html[match.end():]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully injected the updated real images gallery.")
else:
    print("Failed to find the Real Images section. Trying alternative pattern.")
    # Fallback to search from medium-real to the end of section
    pattern_alt = r'(<div class="gallery-medium-container" id="medium-real"[^>]*>.*?)(?=  </section>)'
    match_alt = re.search(pattern_alt, html, re.DOTALL)
    if match_alt:
        html = html[:match_alt.start()] + gallery + html[match_alt.end():]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Successfully injected via alt pattern.")
    else:
        print("Error injecting gallery.")
