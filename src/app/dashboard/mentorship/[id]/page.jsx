import React from 'react';
import MentorDetail from '@/app/components/mentorship/MentorDetail';


const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <MentorDetail id={id} />;
    </div>
  )
}

export default page;
