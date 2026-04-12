  import React from 'react';
  import Card from '../../Components/Products/Card.jsx';

  const CardFilter = ({ data = [], fallback = [] }) => {
    const listToRender = data.length > 0 ? data : fallback;

    return (
      <div className="flex flex-wrap gap-6">
        {listToRender.length > 0 ? (
          listToRender.map((pg) => <Card key={pg._id} details={pg} />)
        ) : (
          <p className="text-gray-500 font-medium">No PGs found</p>
        )}
      </div>
    );
  };

  export default CardFilter;
