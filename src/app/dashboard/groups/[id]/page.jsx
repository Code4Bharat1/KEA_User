import React from 'react';
import GroupDetail from '@/app/components/Groups/GroupDetail';


const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <GroupDetail id={id} />;
    </div>
  )
}

export default page;
