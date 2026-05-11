'use client';
import { motion } from 'framer-motion';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === opt.value
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-body border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}