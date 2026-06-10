import os
import urllib.parse
from PIL import Image

base_dir = r"c:\Users\himan\Downloads\Portfolio\Portfolio_media\Real_Images"
thumb_dir = r"c:\Users\himan\Downloads\Portfolio\Portfolio_media\Real_Images_Thumbs"

if not os.path.exists(thumb_dir):
    os.makedirs(thumb_dir)

# Category definitions: (folder_name, display_name, filter_id)
categories = [
    ("2BHK_Flat_Bangalore", "2 BHK Flat – Bangalore", "2bhk_bangalore"),
    ("3_BHK_Bangalore", "3 BHK – Bangalore", "3bhk_bangalore"),
    ("Villa_Temple", "Villa Temple", "villa_temple"),
    ("2_BHK", "2 BHK", "2bhk"),
    ("2_BHK_Flat", "2 BHK Flat", "2bhk_flat"),
    ("3BHK_Flat_Hyderabad", "3 BHK Flat – Hyderabad", "3bhk_hyderabad"),
]

image_exts = {'.jpeg', '.jpg', '.png', '.webp'}
video_exts = {'.mp4', '.mov', '.webm'}

html_items = []

for folder, display_name, filter_id in categories:
    folder_path = os.path.join(base_dir, folder)
    if not os.path.isdir(folder_path):
        continue

    files = os.listdir(folder_path)
    
    # Separate TOP and non-TOP, images and videos
    top_images = []
    normal_images = []
    top_videos = []
    normal_videos = []

    for f in files:
        ext = os.path.splitext(f)[1].lower()
        is_top = "_TOP" in f or "_top" in f
        
        if ext in image_exts:
            if is_top:
                top_images.append(f)
            else:
                normal_images.append(f)
        elif ext in video_exts:
            if is_top:
                top_videos.append(f)
            else:
                normal_videos.append(f)
    
    # Sort each group
    top_images.sort()
    normal_images.sort()
    top_videos.sort()
    normal_videos.sort()
    
    # TOP images first, then normal images, then TOP videos, then normal videos
    ordered = top_images + normal_images + top_videos + normal_videos
    
    for f in ordered:
        ext = os.path.splitext(f)[1].lower()
        # URL-encode the filename for the src attribute
        encoded_path = f"Portfolio_media/Real_Images/{folder}/{urllib.parse.quote(f)}"
        
        if ext in video_exts:
            html_items.append(
                f'        <div class="g-item real-item" data-project="{filter_id}">\n'
                f'          <video src="{encoded_path}" loading="lazy" muted loop playsinline preload="metadata"></video>\n'
                f'          <span class="g-cap">{display_name}</span>\n'
                f'          <span class="g-video-badge">▶ Video</span>\n'
                f'        </div>'
            )
        else:
            # Process thumbnail
            orig_path = os.path.join(base_dir, folder, f)
            folder_thumb_dir = os.path.join(thumb_dir, folder)
            if not os.path.exists(folder_thumb_dir):
                os.makedirs(folder_thumb_dir)
            
            # Use .jpg for thumbnail even if original is .png, etc.
            thumb_name = os.path.splitext(f)[0] + ".jpg"
            thumb_path_local = os.path.join(folder_thumb_dir, thumb_name)
            encoded_thumb_path = f"Portfolio_media/Real_Images_Thumbs/{folder}/{urllib.parse.quote(thumb_name)}"
            
            if not os.path.exists(thumb_path_local):
                try:
                    print(f"Generating thumbnail for {f}...")
                    with Image.open(orig_path) as img:
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                        img.save(thumb_path_local, "JPEG", quality=75)
                except Exception as e:
                    print(f"Error generating thumbnail for {f}: {e}")
                    encoded_thumb_path = encoded_path # Fallback

            html_items.append(
                f'        <div class="g-item real-item" data-project="{filter_id}">\n'
                f'          <img src="{encoded_thumb_path}" data-full-src="{encoded_path}" alt="{display_name}" loading="lazy" />\n'
                f'          <span class="g-cap">{display_name}</span>\n'
                f'        </div>'
            )

# Build the filter buttons without 'All Projects' at the start
filter_buttons = ''
for i, (_, display_name, filter_id) in enumerate(categories):
    active_class = ' active' if i == 0 else ''
    filter_buttons += f'    <button class="room-filter{active_class}" data-project="{filter_id}">{display_name}</button>\n'

# Add 'All Projects' at the end
filter_buttons += '    <button class="room-filter" data-project="all">All Projects</button>\n'

# Assemble full section
full_html = f"""    <div class="gallery-medium-container" id="medium-real" style="display: none;">
  <div class="room-filters" style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; padding: 0 clamp(1.5rem, 4vw, 3.5rem);">
{filter_buttons}  </div>
  <div class="project-gallery categorized-gallery" style="padding: 0 clamp(1.5rem, 4vw, 3.5rem); max-width: 1400px; margin: 0 auto;">
{chr(10).join(html_items)}
      </div>
    </div>"""

# Write output
output_path = r"c:\Users\himan\Downloads\Portfolio\real_images_gallery.html"
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"Generated gallery HTML with {len(html_items)} items")
print(f"Output: {output_path}")

# Print category counts
for folder, display_name, filter_id in categories:
    folder_path = os.path.join(base_dir, folder)
    if os.path.isdir(folder_path):
        files = os.listdir(folder_path)
        imgs = [f for f in files if os.path.splitext(f)[1].lower() in image_exts]
        vids = [f for f in files if os.path.splitext(f)[1].lower() in video_exts]
        tops = [f for f in files if "_TOP" in f or "_top" in f]
        print(f"  {display_name}: {len(imgs)} images, {len(vids)} videos, {len(tops)} TOP items")
