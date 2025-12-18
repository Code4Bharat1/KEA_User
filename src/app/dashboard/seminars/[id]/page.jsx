import React from 'react';
import SeminarDetail from '@/app/components/Seminar/SeminarDetail';


const page = async ({ params }) => {
  const { id } = await params;
//   console.log("Member ID from params:", id);
  return (
    <div>
      <SeminarDetail id={id} />;
    </div>
  )
}

export default page;
