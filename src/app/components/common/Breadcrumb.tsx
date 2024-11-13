import React from "react";

interface BreadcrumbProps {
  titles: { name: string; href?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ titles }) => {
  return (
    <div className="bg-transparent px-6 py-2 xl:px-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          {titles.map((title, index) => (
            <li key={index} className="inline-flex items-center">
              {title.href ? (
                <a
                  href={title.href}
                  className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  {index > 0 && (
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  )}
                  {title.name}
                </a>
              ) : (
                <span
                  className="inline-flex items-center ms-1 text-xs sm:text-sm font-semibold text-red-600 md:ms-2"
                  aria-current="page"
                >
                  {title.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
