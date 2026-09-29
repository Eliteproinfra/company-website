import clsx from "clsx";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/** Live properties.php pagination is Bootstrap's `.page-link` (#0d6efd on white, #dee2e6
 *  border, #e9ecef hover fill) with the active page overridden to `.bg-gold.border-gold`. */
const linkBase =
  "border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:shadow-btn-focus";

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={clsx(
          linkBase,
          "rounded-l-md border-bs-border bg-white text-bs-link hover:bg-bs-dropdown-hover hover:text-bs-link-hover disabled:cursor-not-allowed disabled:text-bs-muted disabled:hover:bg-white"
        )}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={clsx(
            linkBase,
            "-ml-px",
            page === currentPage
              ? "z-[1] border-primary-gold bg-primary-gold text-white"
              : "border-bs-border bg-white text-bs-link hover:bg-bs-dropdown-hover hover:text-bs-link-hover"
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={clsx(
          linkBase,
          "-ml-px rounded-r-md border-bs-border bg-white text-bs-link hover:bg-bs-dropdown-hover hover:text-bs-link-hover disabled:cursor-not-allowed disabled:text-bs-muted disabled:hover:bg-white"
        )}
      >
        Next
      </button>
    </nav>
  );
}
