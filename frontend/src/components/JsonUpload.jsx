import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function JsonUpload({ onData, setIsLoading, isLoading = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState("")
  const { token } = useAuth()

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.json')) {
      alert('Please upload a valid JSON file')
      return
    }
    
    setFileName(file.name)
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        onData(data)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.detail || 'Upload failed'}`)
      }
    } catch (error) {
      alert('Error processing file. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const containerStyle = {
    maxWidth: '512px',
    margin: '0 auto'
  }

  const uploadAreaStyle = {
    position: 'relative',
    border: '2px dashed',
    borderColor: isDragging ? '#FF0050' : '#374151',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.2s',
    backgroundColor: isDragging ? '#1F2937' : 'rgba(31, 41, 55, 0.5)',
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer'
  }

  const inputStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  }

  const iconStyle = {
    width: '64px',
    height: '64px',
    backgroundColor: '#1F2937',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  }

  const titleStyle = {
    color: 'white',
    fontWeight: '500',
    marginBottom: '8px'
  }

  const subtitleStyle = {
    color: '#9CA3AF',
    fontSize: '14px'
  }

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#6B7280',
    fontSize: '12px',
    marginTop: '16px'
  }

  return (
    <div style={containerStyle}>
      <div
        style={uploadAreaStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleChange}
          style={inputStyle}
          disabled={isLoading}
        />
        
        <div>
          <div style={iconStyle}>
            <svg width="32" height="32" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p style={titleStyle}>
              {fileName || "Tap to upload TikTok data"}
            </p>
            <p style={subtitleStyle}>
              or drag and drop
            </p>
          </div>
          
          <div style={footerStyle}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>JSON files only • Max 10MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
