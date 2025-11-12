import React from 'react';
import { Box, Skeleton, SkeletonProps, Stack } from '@mui/material';

export interface LoadingSkeletonProps
  extends Pick<SkeletonProps, 'variant' | 'animation' | 'sx'> {
  width?: SkeletonProps['width'];
  height?: SkeletonProps['height'];
  count?: number;
  ariaLabel?: string;
  spacing?: number;
}

const visuallyHiddenStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)' as const,
  whiteSpace: 'nowrap' as const,
  border: 0,
};

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  ariaLabel = 'Loading content',
  spacing = 1.5,
  width,
  height,
  variant = 'rectangular',
  animation = 'wave',
  sx,
}) => {
  return (
    <Box role="status" aria-live="polite" aria-busy>
      <Stack spacing={spacing}>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton
            key={index}
            variant={variant}
            animation={animation}
            width={width}
            height={height}
            sx={sx}
          />
        ))}
      </Stack>
      <Box component="span" sx={visuallyHiddenStyle}>
        {ariaLabel}
      </Box>
    </Box>
  );
};

export default LoadingSkeleton;

