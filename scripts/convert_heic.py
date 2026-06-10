import os
import pillow_heif
from PIL import Image

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

source_dir = r"C:\Users\himan\OneDrive\Desktop\Potfolio Media\Real Images\2BHK Flat - Bangalore"
dest_dir = r"c:\Users\himan\Downloads\Portfolio\Portfolio_media\Real_Images\2BHK_Flat_Bangalore"

os.makedirs(dest_dir, exist_ok=True)

heic_files = [f for f in os.listdir(source_dir) if f.upper().endswith('.HEIC')]
print(f"Found {len(heic_files)} HEIC files to convert")

for i, filename in enumerate(heic_files, 1):
    src_path = os.path.join(source_dir, filename)
    # Replace .HEIC extension with .jpg
    base_name = os.path.splitext(filename)[0]
    dest_path = os.path.join(dest_dir, base_name + ".jpg")
    
    try:
        img = Image.open(src_path)
        # Convert to RGB if necessary (HEIC can have alpha)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(dest_path, "JPEG", quality=85)
        print(f"[{i}/{len(heic_files)}] Converted: {filename} -> {base_name}.jpg")
    except Exception as e:
        print(f"[{i}/{len(heic_files)}] ERROR converting {filename}: {e}")

print("Done!")
