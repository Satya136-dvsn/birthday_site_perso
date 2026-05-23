import re

def main():
    # 1. Read index.html and insert .letter-paper
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    if '<div class="letter-paper"></div>' not in html:
        html = html.replace(
            '<div class="envelope-back"></div>',
            '<div class="envelope-back"></div>\n                            <div class="letter-paper"></div>'
        )
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated index.html with .letter-paper")

    # 2. Update styles.css
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # --- Add Envelope right flap (::before) ---
    # Find all occurrences of .envelope-front::after and duplicate them for ::before
    # Base CSS:
    if '.envelope-front::before' not in css:
        after_pattern = r'(\.envelope-front::after\s*\{[^}]+\})'
        
        def replace_with_before(match):
            after_css = match.group(1)
            before_css = after_css.replace('::after', '::before')
            before_css = before_css.replace('left: -', 'TMP_LEFT')
            before_css = before_css.replace('left:', 'right:')
            before_css = before_css.replace('TMP_LEFT', 'right: -')
            before_css = before_css.replace('border-left:', 'border-right:')
            before_css = before_css.replace('border-left-width:', 'border-right-width:')
            before_css = before_css.replace('border-top-left-radius', 'border-top-right-radius')
            before_css = before_css.replace('border-bottom-left-radius', 'border-bottom-right-radius')
            
            # Change color slightly for right flap
            before_css = before_css.replace('#DFC9C9', '#D8C2C2')
            
            return after_css + '\n\n' + before_css
            
        css = re.sub(after_pattern, replace_with_before, css)
        print("Added .envelope-front::before")

    # Add .letter-paper base styles
    if '.letter-paper {' not in css:
        letter_paper_css = """
.letter-paper {
    position: absolute;
    width: 90%;
    height: 90%;
    background: #FAF9F6;
    left: 5%;
    bottom: 5%;
    border-radius: 6px;
    z-index: 2;
    transition: transform 0.8s ease 0.4s, height 0.8s ease 0.4s;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
"""
        # Insert after .envelope-front
        css = css.replace('.envelope-front {', letter_paper_css + '\n.envelope-front {')
        print("Added .letter-paper styles")

    # Cake Container changes
    # Remove .cake-container.success { transform: scale(0.85); }
    css = re.sub(r'\.cake-container\.success\s*\{[^}]+\}', '', css)
    
    # Update default .cake-container scale
    css = re.sub(r'(\.cake-container\s*\{[^\}]+?)(\})', r'\1    transform: scale(1.25);\n\2', css)
    # Remove duplicates of transform if exist
    def clean_transforms(match):
        block = match.group(1)
        # Keep only the last transform
        transforms = re.findall(r'transform:\s*[^;]+;', block)
        if len(transforms) > 1:
            for t in transforms[:-1]:
                block = block.replace(t, '')
        return block + match.group(2)
    css = re.sub(r'(\.cake-container\s*\{[^\}]+?)(\})', clean_transforms, css)

    # Make .letter-card animation slide out
    css = css.replace('transform: translate(-50%, -50%) scale(0.95);', 'transform: translate(-50%, 0%) scale(0.7);')

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated styles.css with cake scale and animations")

if __name__ == "__main__":
    main()
