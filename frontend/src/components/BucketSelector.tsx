import { useState } from 'react';
import { 
  TextField, 
  Autocomplete, 
  Chip, 
  Box, 
  Typography, 
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';

interface BucketSelectorProps {
  value: string;
  onChange: (bucket: string) => void;
  label?: string;
  placeholder?: string;
}

// Mock recent buckets for better UX
const getRecentBuckets = () => {
  const stored = localStorage.getItem('recentBuckets');
  return stored ? JSON.parse(stored) : ['my-documents', 'backup-files', 'project-assets'];
};

const saveRecentBucket = (bucket: string) => {
  if (!bucket.trim()) return;
  
  const recent = getRecentBuckets();
  const updated = [bucket, ...recent.filter(b => b !== bucket)].slice(0, 5);
  localStorage.setItem('recentBuckets', JSON.stringify(updated));
};

export default function BucketSelector({ 
  value, 
  onChange, 
  label = "Bucket Name",
  placeholder = "Enter bucket name or select from recent"
}: BucketSelectorProps) {
  const [recentBuckets] = useState(getRecentBuckets());
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (newValue) {
      saveRecentBucket(newValue);
    }
  };

  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue) {
      handleChange(inputValue);
    }
  };

  return (
    <Box>
      <Autocomplete
        freeSolo
        value={value}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            handleChange(newValue);
          }
        }}
        options={recentBuckets}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            fullWidth
            onKeyPress={handleKeyPress}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  📁
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {inputValue && (
                    <Tooltip title="Create/Use this bucket">
                      <IconButton 
                        size="small" 
                        onClick={() => handleChange(inputValue)}
                        color="primary"
                      >
                        ➕
                      </IconButton>
                    </Tooltip>
                  )}
                </InputAdornment>
              )
            }}
            helperText={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Bucket will be created automatically if it doesn't exist
                </Typography>
              </Box>
            }
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🕒
            <Typography variant="body2">{option}</Typography>
            <Chip label="Recent" size="small" variant="outlined" sx={{ ml: 'auto' }} />
          </Box>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              key={option}
              size="small"
            />
          ))
        }
      />
      
      {recentBuckets.length > 0 && !value && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Recent buckets:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {recentBuckets.slice(0, 3).map((bucket) => (
              <Chip
                key={bucket}
                label={bucket}
                size="small"
                variant="outlined"
                onClick={() => handleChange(bucket)}
                icon={<span>🕒</span>}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}