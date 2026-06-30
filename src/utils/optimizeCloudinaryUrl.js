export function optimizeCloudinaryUrl(url, { width, quality = "auto", format = "auto" } = {}) {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return typeof url === "string" ? url : null;
  }

  const transformations = [`f_${format}`, `q_${quality}`];
  if (width) transformations.push(`w_${width}`);

  return url.replace("/upload/", `/upload/${transformations.join(",")}/`);
}