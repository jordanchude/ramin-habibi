#!/usr/bin/env python3
import os
import re
from pathlib import Path

def process_html_file(filepath):
    """Remove all Aquay references from an HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace title tags
    content = re.sub(
        r'<title>Aquay - Webflow HTML Website Template</title>',
        '<title>Ramin Habibi - Luxury Real Estate</title>',
        content
    )
    
    # Replace meta descriptions
    content = re.sub(
        r'Aquay is an elegant showcase for high-end property developments and real estate businesses including everything required to launch a tasteful web presence\.',
        'Ramin Habibi offers luxury real estate services and premium property consultations for discerning clients.',
        content
    )
    
    # Replace OG and Twitter meta tags
    content = re.sub(
        r'<meta content="Aquay - Webflow HTML Website Template" property="og:title">',
        '<meta content="Ramin Habibi - Luxury Real Estate" property="og:title">',
        content
    )
    content = re.sub(
        r'<meta content="Aquay - Webflow HTML Website Template" property="twitter:title">',
        '<meta content="Ramin Habibi - Luxury Real Estate" property="twitter:title">',
        content
    )
    
    # Replace Aquay logo in navbar with text logo (dark version)
    content = re.sub(
        r'<a id="w-node-_5c6ae061-b7f3-3993-0d6f-68cf6ad547cd-6ad547c9" href="(\.\./)?(index\.html)"[^>]*><img src="(\.\./)?(images/Aquay-Small-Dark\.svg)" alt=""></a>',
        r'<a id="w-node-_5c6ae061-b7f3-3993-0d6f-68cf6ad547cd-6ad547c9" href="\2" class="w-inline-block"><div class="logo-text">Ramin Habibi</div></a>',
        content
    )
    
    # Replace Aquay logo in navbar with text logo (white version)
    content = re.sub(
        r'<a id="w-node-_1fb68cae-1399-1683-4f37-a3e2705aa34a-705aa346" href="(\.\./)?(index\.html)" class="w-inline-block"><img src="(\.\./)?(images/Aquay-Small-White\.svg)" alt=""></a>',
        r'<a id="w-node-_1fb68cae-1399-1683-4f37-a3e2705aa34a-705aa346" href="\2" class="w-inline-block"><div class="logo-text" style="color: var(--white);">Ramin Habibi</div></a>',
        content
    )
    
    # Replace hero logo
    content = re.sub(
        r'<img src="(\.\./)?(images/Aquay-Large-White\.svg)" alt="" class="hero-logo">',
        '<div class="hero-logo-text">Ramin Habibi</div>',
        content
    )
    
    # Remove "purchase aquay" button from navbar (dark version)
    content = re.sub(
        r'<a href="https://mmra\.re/purchaseaquay" target="_blank" class="button w-inline-block">\s*<div>purchase aquay</div><img src="(\.\./)?(images/icon-arrow-right\.svg)" alt="">\s*</a>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove "purchase aquay" button from navbar (white version)
    content = re.sub(
        r'<a href="https://mmra\.re/purchaseaquay" target="_blank" class="button white w-inline-block">\s*<div>purchase aquay</div><img src="(\.\./)?(images/icon-arrow-right-white\.svg)" alt="">\s*</a>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Replace footer logo
    content = re.sub(
        r'<a id="w-node-c8fec492-371b-c61c-6997-591d9743fdd1-9743fdcd" href="#" class="w-inline-block"><img src="(\.\./)?(images/Aquay-Footer-White\.svg)" alt=""></a>',
        '<div class="hero-logo-text" style="color: var(--white); font-size: 32px;">Ramin Habibi</div>',
        content
    )
    
    # Replace footer copyright
    content = re.sub(
        r'Copyright – A <a href="https://mediumrare\.shop/[^"]*" target="_blank" class="text-white">Medium Rare</a> Template',
        'Copyright © 2025 Ramin Habibi. All rights reserved.',
        content
    )
    
    # Remove Aquay logo from loading container
    content = re.sub(
        r'<div class="loading-container"><img src="(\.\./)?(images/loader\.svg)" loading="eager" alt="" class="loader"><img src="(\.\./)?(images/Aquay-Small-Dark\.svg)" loading="eager" alt=""></div>',
        r'<div class="loading-container"><img src="\2" loading="eager" alt="" class="loader"></div>',
        content
    )
    
    # Replace any remaining "Aquay" text in content (but be careful not to break URLs)
    # This is for content like "Nestled in the iconic heart of Greenwich, Aquay is..."
    content = re.sub(
        r'Greenwich, Aquay is an immersive sanctuary',
        'Greenwich, this property is an immersive sanctuary',
        content
    )
    
    # Only write if content changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Find all HTML files except in template folder
html_files = []
for root, dirs, files in os.walk('.'):
    # Skip template directory
    if 'template' in root.split(os.sep):
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

# Process each file
modified_count = 0
for filepath in html_files:
    if process_html_file(filepath):
        modified_count += 1
        print(f"Modified: {filepath}")

print(f"\nTotal files modified: {modified_count}/{len(html_files)}")
