import { useDropzone } from 'react-dropzone'

interface FileUploaderProps {
  onFileUpload: (file: File) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) onFileUpload(file)
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  })

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Upload Excel File</h2>
      <div {...getRootProps()} className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here ...</p>
        ) : (
          <p>Drag and drop an Excel file here, or click to select a file</p>
        )}
      </div>
    </section>
  )
} 