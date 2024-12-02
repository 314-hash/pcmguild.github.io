import React from 'react';
import { Box, Stack } from '@mui/material';

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: '32px',
    medium: '48px',
    large: '64px'
  };

  const logoStyle = {
    height: sizes[size],
    width: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        component="img"
        sx={logoStyle}
        alt="PCM Guild Logo 1"
        src="https://ipfs.io/ipfs/Qmdo1zVc243HfmGnb9bb7egNer1nddk2wtwz9XxAMtpuFi"
      />
      <Box
        component="img"
        sx={logoStyle}
        alt="PCM Guild Logo 2"
        src="https://ipfs.io/ipfs/QmZJTPEkcXKLE6yQnLBfe5kAD7n8R9aricsYXVGEWcxug7"
      />
    </Stack>
  );
};

export default Logo;
