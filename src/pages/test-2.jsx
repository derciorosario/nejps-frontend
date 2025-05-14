import React from 'react';

const CharityStats = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Main heading and description */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          We've funded <span className="text-blue-600">120,000</span> charity
          projects for <span className="text-blue-600">20M</span> people around the
          world.
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Continued attending smallness is on by unveiling Trumpet favour man two but lovers.
          Safire should it waiter common person talk on. Improved charity graceful see few
          smallest screened settings. Likely active her warmly has
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard number="1345" label="Food Served" />
        <StatCard number="83778" label="Volunteer" />
        <StatCard number="276450" label="Blood Donated" />
        <StatCard number="4567" label="Happy Children" />
      </div>
    </div>
  );
};

const StatCard = ({ number, label }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600 uppercase text-sm font-medium">{label}</div>
    </div>
  );
};

export default CharityStats;