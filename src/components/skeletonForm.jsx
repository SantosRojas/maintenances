import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
  

export default function Variants() {

  return (
    <Stack spacing={'1rem'}>
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
      <Skeleton variant="rounded" width={'100%'} height={40} />
    </Stack>
  );
}