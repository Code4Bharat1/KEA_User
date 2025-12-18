import React from 'react';
import EventDetail from '@/app/components/events/EventsDetails';


const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <EventDetail id={id} />;
    </div>
  )
}

export default page;
