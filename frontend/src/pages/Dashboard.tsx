import { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Button, Grid, LinearProgress, Chip, IconButton, Tooltip, Card, CardContent, Snackbar, Backdrop, CircularProgress } from '@mui/material';
import BucketSelector from '../components/BucketSelector';
import FileList from '../components/FileList';
import TransferForm from '../components/TransferForm';
import TransferStatus from '../components/TransferStatus';
import { listFiles, uploadFile, downloadFile } from '../api/s3Api';

type TransferState = 'idle' | 'transferring' | 'completed' | 'error';

export default function Dashboard() {
  const [sourceBucket, setSourceBucket] = useState('');
  const [destBucket, setDestBucket] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferState>('idle');
  const [uploadFile_, setUploadFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const loadFiles = async () => {
    if (!sourceBucket) {
      showNotification('Please enter a source bucket name first', 'warning');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const fileList = await listFiles(sourceBucket);
      setFiles(fileList);
      const message = fileList.length > 0 
        ? `Found ${fileList.length} files in "${sourceBucket}"` 
        : `Bucket "${sourceBucket}" is empty or newly created`;
      showNotification(message, 'success');
    } catch (err) {
      const errorMsg = 'Failed to load files. Check bucket name or AWS credentials.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile_ || !sourceBucket) {
      showNotification('Please select a file and enter a bucket name', 'warning');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      await uploadFile(sourceBucket, uploadFile_);
      setUploadProgress(100);
      showNotification(`"${uploadFile_.name}" uploaded successfully`, 'success');
      setUploadFile(null);
      setTimeout(() => setUploadProgress(0), 1000);
      loadFiles();
    } catch (err) {
      const errorMsg = 'Upload failed. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFile || !sourceBucket) {
      showNotification('Please select a file to download', 'warning');
      return;
    }

    try {
      const blob = await downloadFile(sourceBucket, selectedFile);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification(`"${selectedFile}" downloaded successfully`, 'success');
    } catch (err) {
      const errorMsg = 'Download failed. Please try again.';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setUploadFile(droppedFiles[0]);
      showNotification(`"${droppedFiles[0].name}" ready for upload`, 'info');
    }
  };

  const getStepStatus = () => {
    const steps = [
      { completed: !!sourceBucket, label: 'Source bucket' },
      { completed: files.length > 0, label: 'Files loaded' },
      { completed: !!destBucket, label: 'Destination bucket' },
      { completed: !!selectedFile, label: 'File selected' }
    ];
    return steps;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>📁 S3 File Transfer Dashboard</Typography>
      
      {/* Progress Indicator */}
      <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>ℹ️ Quick Start Progress</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>            {getStepStatus().map((step, index) => (
              <Chip
                key={index}
                label={step.label}
                color={step.completed ? 'success' : 'default'}
                variant={step.completed ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>
      
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      
      <Grid container spacing={3}>
        {/* Source Bucket */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', border: sourceBucket ? '2px solid #4caf50' : '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📂 Source Bucket {sourceBucket && <Chip label="Active" color="success" size="small" />}
              </Typography>
              <BucketSelector 
                value={sourceBucket} 
                onChange={setSourceBucket}
                label="Source Bucket Name"
                placeholder="Enter source bucket name"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button 
                  onClick={loadFiles} 
                  disabled={loading || !sourceBucket}
                  variant="contained"
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Loading...' : '🔄 Load Files'}
                </Button>
                {files.length > 0 && (
                  <Chip label={`${files.length} files`} color="info" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Destination Bucket */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', border: destBucket ? '2px solid #ff9800' : '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📁 Destination Bucket {destBucket && <Chip label="Ready" color="warning" size="small" />}
              </Typography>
              <BucketSelector 
                value={destBucket} 
                onChange={setDestBucket}
                label="Destination Bucket Name"
                placeholder="Enter destination bucket name"
              />
              {sourceBucket && destBucket && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>{sourceBucket}</Typography>
                  <Typography sx={{ mx: 1 }}>➡️</Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>{destBucket}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>☁️ Upload File</Typography>
              
              <Box 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  border: dragOver ? '2px dashed #2196f3' : '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: dragOver ? 'primary.50' : 'grey.50',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  mb: 2
                }}
              >
                <input 
                  type="file" 
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                  {uploadFile_ ? (
                    <Box>
                      <Typography variant="h3">📄</Typography>
                      <Typography variant="body1" fontWeight="bold">{uploadFile_.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(uploadFile_.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h3">☁️</Typography>
                      <Typography variant="body1">Drag & drop file here or click to browse</Typography>
                      <Typography variant="body2" color="text.secondary">Supports all file types, max 100MB</Typography>
                    </Box>
                  )}
                </label>
              </Box>
              
              {uploadProgress > 0 && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" align="center">
                    Uploading... {uploadProgress}%
                  </Typography>
                </Box>
              )}
              
              <Button 
                onClick={handleUpload}
                disabled={loading || !uploadFile_ || !sourceBucket}
                variant="contained"
                fullWidth
              >
                ⬆️ Upload to {sourceBucket || 'Bucket'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* File Operations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🔧 File Operations</Typography>
              {selectedFile ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Selected: <strong>{selectedFile}</strong>
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No file selected. Click on a file in the list below.
                </Alert>
              )}
              <Button 
                onClick={handleDownload}
                disabled={!selectedFile || !sourceBucket}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              >
                ⬇️ Download Selected File
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* File List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">📋 Files in {sourceBucket || 'Bucket'}</Typography>
                {sourceBucket && (
                  <Button onClick={loadFiles} disabled={loading} size="small">
                    🔄 Refresh
                  </Button>
                )}
              </Box>
              {loading && <LinearProgress sx={{ mb: 2 }} />}
              <FileList files={files} selectedFile={selectedFile} onSelect={setSelectedFile} />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Transfer Section */}
        <Grid item xs={12}>
          <Card sx={{ border: transferStatus === 'transferring' ? '2px solid #2196f3' : '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">🔄 File Transfer</Typography>
                {transferStatus === 'transferring' && <Chip label="In Progress" color="primary" sx={{ ml: 'auto' }} />}
                {transferStatus === 'completed' && <Chip label="Completed" color="success" sx={{ ml: 'auto' }} />}
                {transferStatus === 'error' && <Chip label="Failed" color="error" sx={{ ml: 'auto' }} />}
              </Box>
              <TransferForm 
                sourceBucket={sourceBucket} 
                destinationBucket={destBucket} 
                fileKey={selectedFile}
                onStatusChange={setTransferStatus}
              />
              <TransferStatus status={transferStatus} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && uploadProgress === 0}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
        </Box>
      </Backdrop>
    </Container>
  );
}