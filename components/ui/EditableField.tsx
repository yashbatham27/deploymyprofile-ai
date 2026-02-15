import React, { useState, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  isEditing,
  className = '',
  multiline = false,
  placeholder = ''
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (isEditing) {
    const commonClasses = `bg-transparent border border-dashed border-gray-400/50 rounded px-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-full font-inherit text-inherit ${className}`;
    
    if (multiline) {
      return (
        <textarea
          className={commonClasses}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => onSave(localValue)}
          placeholder={placeholder}
          style={{ minHeight: '1.5em', height: 'auto' }}
          rows={Math.max(3, localValue.split('\n').length)}
        />
      );
    }
    return (
      <input
        type="text"
        className={commonClasses}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onSave(localValue)}
        placeholder={placeholder}
      />
    );
  }

  // Render text, preserving line breaks if it was multiline
  return (
    <span className={`${className} whitespace-pre-wrap`}>
      {value || placeholder}
    </span>
  );
};