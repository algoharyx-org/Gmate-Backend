/**
 * Reusable pagination logic
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {object} - { skip, limit, page }
 */
export const getPagination = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const skip = (p - 1) * l;
  return { skip, limit: l, page: p };
};

/**
 * Format pagination metadata for the response
 * @param {number} totalCount - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} - Metadata object
 */
export const getPaginationMetadata = (totalCount, page, limit) => {
  return {
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPrevPage: page > 1,
  };
};
