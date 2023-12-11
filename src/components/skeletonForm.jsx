import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Variants() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
      <Skeleton variant="rounded" width={295} height={60} />
    </Stack>
  );
}