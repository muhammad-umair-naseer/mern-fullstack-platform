"""
Generate custom, high-resolution WebP architecture diagrams for all 63 blog posts.
Embeds them seamlessly into markdown content with SEO-rich alt text and captions.
"""
import os
import re
import math
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, 'client', 'content', 'blog')
OUT_DIR = os.path.join(ROOT, 'client', 'public', 'blog', 'diagrams')

os.makedirs(OUT_DIR, exist_ok=True)

# Fonts
FONT_BOLD_PATH = 'C:/Windows/Fonts/segoeuib.ttf'
FONT_REG_PATH = 'C:/Windows/Fonts/segoeui.ttf'
FONT_SEMI_PATH = 'C:/Windows/Fonts/segoeuisl.ttf'

if not os.path.exists(FONT_BOLD_PATH):
    FONT_BOLD_PATH = 'C:/Windows/Fonts/arialbd.ttf'
if not os.path.exists(FONT_REG_PATH):
    FONT_REG_PATH = 'C:/Windows/Fonts/arial.ttf'

font_h1 = ImageFont.truetype(FONT_BOLD_PATH, 34)
font_h2 = ImageFont.truetype(FONT_BOLD_PATH, 20)
font_badge = ImageFont.truetype(FONT_BOLD_PATH, 13)
font_body = ImageFont.truetype(FONT_REG_PATH, 15)
font_bold = ImageFont.truetype(FONT_BOLD_PATH, 15)
font_small = ImageFont.truetype(FONT_REG_PATH, 13)
font_mono = ImageFont.truetype(FONT_BOLD_PATH, 14)

def parse_frontmatter(text):
    m = re.match(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n?', text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if ':' in line:
            k, v = line.split(':', 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
            meta[k] = v
    return meta, text[m.end():]

def extract_stages(body, title):
    # Try to extract bullet points or stages from body
    h3s = re.findall(r'^###\s+(?:Stage\s*\d+:?|Step\s*\d+:?|\d+\.?\s*)?([^\n]+)', body, re.MULTILINE)
    if len(h3s) >= 4:
        return [h.strip() for h in h3s[:4]]
    
    h2s = re.findall(r'^##\s+(?:Stage\s*\d+:?|Step\s*\d+:?|\d+\.?\s*)?([^\n]+)', body, re.MULTILINE)
    # Filter out FAQ, Mistakes, Who this is for
    h2_filtered = [h.strip() for h in h2s if not re.search(r'(faq|frequently|mistake|who|certificate|exam|summary)', h, re.I)]
    if len(h2_filtered) >= 4:
        return h2_filtered[:4]
    
    # Defaults tailored to topics
    t_lower = title.lower()
    if 'data' in t_lower or 'analyst' in t_lower:
        return ['Data Extraction & SQL', 'Cleaning & Transformation', 'EDA & Visualization', 'Insight & Decision Models']
    elif 'ai' in t_lower or 'machine' in t_lower:
        return ['Math & Python Foundation', 'Prompting & Structured Data', 'RAG & Vector Pipelines', 'Production Evals & Agents']
    elif 'devops' in t_lower or 'cloud' in t_lower or 'docker' in t_lower:
        return ['Linux & Networking Basics', 'Docker Containerization', 'Automated CI/CD Pipelines', 'Cloud Infra & Kubernetes']
    elif 'front' in t_lower or 'react' in t_lower or 'web' in t_lower:
        return ['Semantic HTML & CSS Grid', 'Vanilla JavaScript & Async', 'Component Architecture', 'Performance & Deployment']
    elif 'python' in t_lower or 'cpp' in t_lower or 'programming' in t_lower:
        return ['Syntax & Core Data Types', 'Algorithms & Modular Design', 'API Integration & Files', 'Full Production Project']
    elif 'marketing' in t_lower or 'social' in t_lower or 'youtube' in t_lower:
        return ['Audience & Market Research', 'Content Strategy & Hooks', 'Distribution & Analytics', 'Monetization & Scaling']
    else:
        return ['Foundations & Concepts', 'Core Tools & Architecture', 'Practical Implementation', 'Production & Certification']

def draw_diagram(slug, title, target_query, stages):
    width, height = 1200, 675
    img = Image.new('RGB', (width, height), color='#0a0e1a')
    draw = ImageDraw.Draw(img)

    # Gradient background glow
    for r in range(400, 0, -20):
        alpha = int(25 * (1 - r / 400))
        # Top right indigo glow
        draw.ellipse([800 - r, 100 - r, 800 + r, 100 + r], fill=(20, 28, 55))
        # Bottom left teal glow
        draw.ellipse([300 - r, 550 - r, 300 + r, 550 + r], fill=(12, 32, 45))

    # Outer Glassmorphic Frame
    draw.rounded_rectangle([40, 35, 1160, 640], radius=18, fill='#111728', outline='#1e293b', width=2)
    
    # Top Subtle Glow Accent Bar
    draw.rounded_rectangle([40, 35, 1160, 42], radius=4, fill='#6366f1')

    # Top Pill Badge
    badge_text = "CORTEXIS TECHNICAL FRAMEWORK · SYSTEM ARCHITECTURE BLUEPRINT"
    draw.rounded_rectangle([70, 65, 590, 95], radius=15, fill='#1e1b4b', outline='#4338ca', width=1)
    draw.text((85, 71), badge_text, fill='#a5b4fc', font=font_badge)

    # Verification Tag on right
    verif_text = "SECP CUIN: 0306803 · 100% FREE ACADEMY"
    draw.rounded_rectangle([860, 65, 1130, 95], radius=15, fill='#064e3b', outline='#059669', width=1)
    draw.text((875, 71), verif_text, fill='#6ee7b7', font=font_badge)

    # Main Title
    display_title = title if len(title) <= 58 else title[:55] + "…"
    draw.text((70, 115), display_title, fill='#f8fafc', font=font_h1)

    # Subtitle
    sub = f"End-to-End Architectural Roadmap: Key Mastery Stages & Implementation Pipeline"
    draw.text((70, 168), sub, fill='#94a3b8', font=font_body)

    # Main 4 Stage Pipeline Cards
    card_y = 220
    card_h = 320
    card_w = 235
    spacing = 38
    start_x = 70

    colors = [
        {'bg': '#0f172a', 'border': '#06b6d4', 'num_bg': '#0891b2', 'title': '#38bdf8'},
        {'bg': '#0f172a', 'border': '#6366f1', 'num_bg': '#4f46e5', 'title': '#818cf8'},
        {'bg': '#0f172a', 'border': '#a855f7', 'num_bg': '#9333ea', 'title': '#c084fc'},
        {'bg': '#0f172a', 'border': '#10b981', 'num_bg': '#059669', 'title': '#34d399'},
    ]

    for i, stage_text in enumerate(stages):
        x = start_x + i * (card_w + spacing)
        c = colors[i % len(colors)]
        
        # Card Background
        draw.rounded_rectangle([x, card_y, x + card_w, card_y + card_h], radius=14, fill=c['bg'], outline=c['border'], width=2)
        
        # Top Accent Header in Card
        draw.rounded_rectangle([x, card_y, x + card_w, card_y + 48], radius=12, fill='#1e293b')
        draw.rounded_rectangle([x + 12, card_y + 10, x + 40, card_y + 38], radius=14, fill=c['num_bg'])
        draw.text((x + 18, card_y + 14), f"0{i+1}", fill='#ffffff', font=font_mono)
        draw.text((x + 48, card_y + 16), f"PHASE {i+1}", fill='#cbd5e1', font=font_badge)

        # Stage Name (Cleanly Wrapped)
        stage_title = stage_text
        if len(stage_title) > 24:
            words = stage_title.split()
            line1 = " ".join(words[:2])
            line2 = " ".join(words[2:5])
            draw.text((x + 16, card_y + 65), line1, fill=c['title'], font=font_h2)
            draw.text((x + 16, card_y + 92), line2, fill=c['title'], font=font_h2)
            content_y = card_y + 130
        else:
            draw.text((x + 16, card_y + 65), stage_title, fill=c['title'], font=font_h2)
            content_y = card_y + 105

        # Divider
        draw.line([x + 16, content_y, x + card_w - 16, content_y], fill='#334155', width=1)

        # 3 Concept Bullet Points
        bullets = [
            "Core principles & toolchain",
            "Hands-on exercises & builds",
            "Automated test validation",
        ]
        for b_idx, b in enumerate(bullets):
            by = content_y + 18 + b_idx * 50
            draw.ellipse([x + 16, by + 4, x + 24, by + 12], fill=c['num_bg'])
            draw.text((x + 32, by), b, fill='#94a3b8', font=font_small)

        # Arrow between cards
        if i < len(stages) - 1:
            arrow_x = x + card_w + 10
            arrow_y = card_y + card_h // 2 - 12
            draw.polygon([(arrow_x, arrow_y + 6), (arrow_x + 14, arrow_y + 12), (arrow_x, arrow_y + 18)], fill='#64748b')

    # Bottom Footer Status Bar
    draw.line([70, 570, 1130, 570], fill='#1e293b', width=1)
    
    draw.text((70, 590), "✦ Client-Side Privacy Architecture · Zero Server Uploads · Verified Digital Certificates", fill='#64748b', font=font_small)
    draw.text((915, 590), "cortexissolutionhub.com", fill='#818cf8', font=font_bold)

    # Save as WebP
    out_file = os.path.join(OUT_DIR, f"{slug}-architecture.webp")
    img.save(out_file, 'WEBP', quality=85, method=6)
    return out_file

def process_all_blogs():
    files = sorted([f for f in os.listdir(BLOG_DIR) if f.endswith('.md')])
    print(f"Processing {len(files)} blog posts for in-content architecture diagrams...")

    count_generated = 0
    count_updated = 0

    for file_name in files:
        slug = file_name[:-3]
        file_path = os.path.join(BLOG_DIR, file_name)
        
        with open(file_path, 'r', encoding='utf-8') as fp:
            raw = fp.read()

        meta, body = parse_frontmatter(raw)
        title = meta.get('title', slug.replace('-', ' ').title())
        target_query = meta.get('targetQuery', title)
        
        stages = extract_stages(body, title)
        
        # 1. Generate WebP diagram
        out_img = draw_diagram(slug, title, target_query, stages)
        count_generated += 1

        # 2. Check if image is already embedded
        img_rel_url = f"/blog/diagrams/{slug}-architecture.webp"
        if img_rel_url in body:
            continue

        # 3. Choose placement: insert right under the first or second H2
        alt_text = f"Architectural Blueprint and Learning Stages for {title} — Cortexis Roadmap Diagram"
        caption = f"Figure 1: Complete step-by-step architectural workflow and technical execution stages for {title}."
        markdown_snippet = f"\n\n![{alt_text}]({img_rel_url})\n*{caption}*\n\n"

        # Find first H2
        first_h2 = re.search(r'^##\s+[^\n]+', body, re.MULTILINE)
        if first_h2:
            # Look for second paragraph or end of that H2 intro
            next_heading = re.search(r'^##\s+[^\n]+', body[first_h2.end():], re.MULTILINE)
            if next_heading:
                insert_pos = first_h2.end() + next_heading.start()
                new_body = body[:insert_pos] + markdown_snippet + body[insert_pos:]
            else:
                insert_pos = first_h2.end()
                new_body = body[:insert_pos] + markdown_snippet + body[insert_pos:]
        else:
            # Fallback: append after 1st paragraph
            p_end = body.find('\n\n')
            if p_end != -1:
                new_body = body[:p_end] + markdown_snippet + body[p_end:]
            else:
                new_body = markdown_snippet + body

        # Reconstruct file
        # Preserve frontmatter exactly
        m = re.match(r'^---\r?\n([\s\S]*?)\r?\n---\r?\n?', raw)
        full_content = m.group(0) + new_body if m else markdown_snippet + raw
        
        with open(file_path, 'w', encoding='utf-8') as fp:
            fp.write(full_content)

        count_updated += 1

    print(f"Done! Generated {count_generated} diagrams. Updated {count_updated} markdown files with in-content images.")

if __name__ == '__main__':
    process_all_blogs()
