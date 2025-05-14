import React from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';

const CharityStats = () => {
  const { t } = useTranslation();
  const data=useData()

  const campaignCount = data._dashboard.stats?.campaigns || 0;
  const peopleHelped = 300;

  return (
    <div className="max-w-4xl mx-auto px-8 py-14">
      {/* Título principal e descrição */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('charityStats.title.pre')}{' '}
          <span className="text-rose-600">{campaignCount}</span>{' '}
          {t('charityStats.title.middle')}{' '}
          <span className="text-rose-600">{peopleHelped}</span>{' '}
          {t('charityStats.title.post')}
        </h1>
        <p className="text-gray-200 text-lg leading-relaxed">
          {t('charityStats.description')}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard value={campaignCount} label={t('charityStats.campaigns')} />
        <StatCard value={data._dashboard.stats?.volunteers || 0} label={t('charityStats.volunteers')} />
        <StatCard value={data._dashboard.stats?.events || 0} label={t('charityStats.events')} />
        <StatCard value={data._cn(data._dashboard.stats?.totalRaised || 0)} label={t('charityStats.raised')} />
      </div>
    </div>
  );
};

const StatCard = ({ value, label }) => (
  <div className="bg-gray-50 p-6 rounded-lg text-center">
    <div className="text-3xl font-bold text-rose-600 mb-2">{value}</div>
    <div className="text-gray-600 uppercase text-sm font-medium">{label}</div>
  </div>
);

export default CharityStats;
