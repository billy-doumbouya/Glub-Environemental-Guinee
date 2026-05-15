import { useMemo, useState } from "react";

export function useGalleryPagination(images = [], pageSize = 24) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil((images?.length || 0) / pageSize);
  }, [images, pageSize]);

  const paginatedImages = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return images.slice(start, end);
  }, [images, page, pageSize]);

  const nextPage = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };

  const prevPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const goToPage = (p) => {
    const pageNum = Math.max(1, Math.min(p, totalPages));
    setPage(pageNum);
  };

  const resetPage = () => setPage(1);

  return {
    page,
    totalPages,
    paginatedImages,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  };
}
