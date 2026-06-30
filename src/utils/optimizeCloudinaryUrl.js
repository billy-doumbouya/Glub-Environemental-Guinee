export function optimizeCloudinaryUrl(url, { width, quality = "auto", format = "auto" } = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const transformations = [`f_${format}`, `q_${quality}`];
  if (width) transformations.push(`w_${width}`);

  return url.replace("/upload/", `/upload/${transformations.join(",")}/`);
}