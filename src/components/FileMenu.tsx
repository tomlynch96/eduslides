import { useState, useRef, useEffect } from 'react';

interface MenuItem {
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    separator?: boolean;
  }

interface FileMenuProps {
  label: string;
  items: MenuItem[];
}

export function FileMenu({ label, items }: FileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        {label} ▼
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {items.map((item, index) => (
            item.separator ? (
              <div key={index} className="border-t border-gray-200 my-1" />
            ) : (
                <button
                key={index}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white transition-colors"
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}