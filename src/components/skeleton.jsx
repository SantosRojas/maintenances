import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
  

export function FormSkeleton() {

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

export function ListSkeleton() {
  const heightSkeleton = 50
  return (
    <Stack spacing={'1rem'}>
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
      <Skeleton variant="rounded" width={'100%'} height={heightSkeleton} />
    </Stack>
  );
}