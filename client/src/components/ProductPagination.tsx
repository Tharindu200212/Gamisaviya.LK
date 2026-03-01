import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const pages = [];
        // Always show first page
        pages.push(1);

        // Calculate range around current page
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis if gap from start
        if (start > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis if gap to end
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-8">
            {/* Prev Button */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-bold text-primary bg-white border border-primary/30 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-4 py-2 text-gray-400">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page as number)}
                            className={`min-w-[40px] h-10 px-3 flex items-center justify-center rounded-lg font-bold transition-colors border ${currentPage === page
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-primary'
                                }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-6 py-2 rounded-lg font-bold text-primary bg-white border border-primary/30 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Next
            </button>
        </div>
    );
};
