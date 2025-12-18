import React from 'react';
import BlogDetail from '@/app/components/blogs/BlogDetail';


const page = async ({ params }) => {
  const { id } = await params;
//   console.log("Member ID from params:", id);
  return (
    <div>
      <BlogDetail id={id} />;
    </div>
  )
}

export default page;
