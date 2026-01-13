import { List, ListItem, ListItemButton, ListItemText, Typography, Box, Chip, Avatar } from '@mui/material';

interface FileListProps {
  files: string[];
  selectedFile: string;
  onSelect: (file: string) => void;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const colors: { [key: string]: string } = {
    pdf: '#f44336',
    jpg: '#4caf50', jpeg: '#4caf50', png: '#4caf50', gif: '#4caf50',
    doc: '#2196f3', docx: '#2196f3',
    txt: '#9e9e9e',
    zip: '#ff9800', rar: '#ff9800',
    mp4: '#9c27b0', avi: '#9c27b0',
    mp3: '#e91e63', wav: '#e91e63'
  };
  return colors[ext || ''] || '#607d8b';
}

export default function FileList({ files, selectedFile, onSelect }: FileListProps) {
  if (files.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h3">📄</Typography>
        <Typography variant="h6" color="text.secondary">No files found</Typography>
        <Typography variant="body2" color="text.secondary">Upload some files to get started</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {files.map((file) => {
        const isSelected = selectedFile === file;
        const fileExt = file.split('.').pop()?.toLowerCase() || 'file';
        
        return (
          <ListItem 
            key={file} 
            disablePadding
            sx={{
              mb: 1,
              border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
              borderRadius: 2,
              bgcolor: isSelected ? 'primary.50' : 'background.paper',
              '&:hover': {
                bgcolor: isSelected ? 'primary.100' : 'grey.50'
              }
            }}
          >
            <ListItemButton 
              onClick={() => onSelect(file)}
              sx={{ p: 2 }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: getFileIcon(file), 
                  mr: 2, 
                  width: 40, 
                  height: 40,
                  fontSize: '0.8rem'
                }}
              >
                {fileExt.substring(0, 3).toUpperCase()}
              </Avatar>
              
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight={isSelected ? 'bold' : 'normal'}>
                      {file}
                    </Typography>
                    {isSelected && <Chip label="Selected" size="small" color="primary" />}
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Click to select this file
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}