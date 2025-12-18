import React from 'react';
import ThreadDetail from '@/app/components/Forums/ThreadDetail';


const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <ThreadDetail id={id} />;
    </div>
  )
}

export default page;
