'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Mostrar no máximo 5 páginas com elipses
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return [...pages.slice(0, 5), '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', ...pages.slice(-5)];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="Paginação">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-body">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page as number)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}