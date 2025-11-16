import { useRef } from 'react';

interface ImportExportProps {
  lessonName: string;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function ImportExport(props: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImportClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      props.onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-800">Import/Export</h3>
          <p className="text-xs text-gray-500 mt-1">Share lessons or generate with AI</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleImportClick} 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          >
            Import JSON
          </button>
          <button 
            onClick={props.onExport} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Export JSON
          </button>
        </div>
      </div>
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".json" 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}