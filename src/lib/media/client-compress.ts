/**
 * Client-side image compression & optimization.
 * Prevents hitting Nginx client_max_body_size (often 1MB on shared hosting)
 * and speeds up uploads dramatically without losing visible quality.
 */
export async function optimizeImageBeforeUpload(file: File): Promise<File> {
  // If it's already an SVG or tiny image (< 800 KB), no need to compress
  if (file.type === "image/svg+xml" || file.size < 800 * 1024) {
    return file;
  }

  // Only compress raster images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const maxDimension = 1920;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file); // fallback to original
        return;
      }

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format (prefer webp if supported, else jpeg)
      const mimeType = "image/webp";
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compression didn't help, keep original
            resolve(file);
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const optimizedFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        mimeType,
        0.88
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback to original file if loading fails
    };

    img.src = url;
  });
}
