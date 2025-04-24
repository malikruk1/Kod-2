import React from 'react';

export interface TagSelectorProps {
    options: string[];
    selected: string[];
    onChange: (tags: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ options, selected, onChange }) => {
    const add = (tag: string) => {
        onChange([...selected, tag])
    } ;
    const remove = (tag: string) => onChange(selected.filter(t => t !== tag));

    return (
        <div data-testid="genre-selector" className="flex flex-wrap gap-2">
            {selected.map(tag => (
                <span
                    key={tag}
                    className="bg-blue-200 px-2 py-1 rounded flex items-center"
                >
          {tag}
                    <button
                        type="button"
                        onClick={() => remove(tag)}
                        className="ml-1"
                        aria-label={`Remove ${tag}`}
                    >
            ×
          </button>
        </span>
            ))}
            <select
                className="border p-1 rounded"
                onChange={e => add(e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>+ Add genre</option>
                {options.filter(o => !selected.includes(o)).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
};
