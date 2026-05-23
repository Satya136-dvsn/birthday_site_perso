import re

def main():
    print("Modifying index.html...")
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Remove constellation section
    html = re.sub(r'<!-- SECTION 5: STAR CONSTELLATION MAP -->.*?<!-- SECTION 6: THE WISH JAR -->', '<!-- SECTION 6: THE WISH JAR -->', html, flags=re.DOTALL)
    
    # 2. Update gallery "next" button
    html = html.replace('id="next-to-constellation"', 'id="next-to-wish"')
    html = html.replace('<span>See Our Starry Memories ✨</span>', '<span>Make a Birthday Wish 🏺</span>')

    # 3. Add miniature letter to .letter-paper
    fake_text = """<div style="font-size: 7px; padding: 15px; color: #888; font-family: var(--font-serif); line-height: 1.5; opacity: 0.6; filter: blur(0.5px);">
       <h3 style="font-size: 9px; margin-bottom: 6px; font-weight: normal;">Dearest Bestie,</h3>
       <p style="margin-bottom: 4px;">I sat down to write this because, honestly, how do you put years of late-night giggles, shared secrets, and countless cups of tea into a single card?</p>
       <p style="margin-bottom: 4px;">From the days when we had nothing but wild dreams to this exact moment, you have been my anchor, my constant cheerleader, and my absolute favorite human.</p>
       <p style="margin-bottom: 4px;">You have this quiet magic about you that makes everything brighter. Whenever life felt a bit too loud or confusing, just talking to you made it all drift away.</p>
       <p style="margin-bottom: 6px;">Today, I want to celebrate YOU. All the beauty, kindness, and light you bring to the world.</p>
       <p style="text-align: right; font-style: italic;">With all my love,<br>Your Childhood Bestie 💕</p>
    </div>"""
    
    # ensure it only adds it if not already there
    if 'fake_text' not in html and 'Dearest Bestie,' not in html.split('<div class="letter-paper">')[1].split('</div>')[0]:
        html = html.replace('<div class="letter-paper"></div>', f'<div class="letter-paper">\n{fake_text}\n</div>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
        

    print("Modifying script.js...")
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Remove from SCENES
    js = re.sub(r"'constellation-section',\s*", '', js)

    # 2. Remove CONSTELLATION_STARS
    js = re.sub(r'// Constellation Memory Milestones.*?\];\s*', '', js, flags=re.DOTALL)

    # 3. Remove next-to-constellation event listener
    js = re.sub(r"// Transition from Scrapbook Gallery to Star Constellation Map.*?\}\);\s*", '', js, flags=re.DOTALL)

    # 4. Remove initConstellationSky function
    js = re.sub(r'/\* ==========================================================================\s*SECTION 5: STAR CONSTELLATION MAP\s*========================================================================== \*/.*?/\* ==========================================================================', '/* ==========================================================================', js, flags=re.DOTALL)

    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
        
    print("Updates complete.")

if __name__ == "__main__":
    main()
