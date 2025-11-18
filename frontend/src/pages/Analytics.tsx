import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { MarketTable } from '../components/MarketTable';
import { GapCard } from '../components/GapCard';

export const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.getMarketDensity();
      // Backend returns { success: true, data: {...} }
      // axios response wraps it in response.data
      const analyticsData = response.data.data || response.data;
      setData(analyticsData);
      setError(null);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!data) return <div className="empty-state">No data available</div>;

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Market Intelligence</h1>

      {/* Opportunities */}
      {data.opportunities && data.opportunities.length > 0 && (
        <section className="analytics-section">
          <h2 className="analytics-subtitle">💡 Opportunities</h2>
          {data.opportunities.slice(0, 5).map((opp: any, idx: number) => (
            <OpportunityCard 
              key={idx}
              category={opp.category}
              cityType={opp.cityType}
              reason={opp.reason}
            />
          ))}
        </section>
      )}

      {/* Markets */}
      {data.byCities && data.byCities.length > 0 && (
        <section className="analytics-section">
          <h2 className="analytics-subtitle">🏙️ Markets</h2>
          <MarketTable cities={data.byCities} />
        </section>
      )}

      {/* What's Missing */}
      {data.categoryGaps && data.categoryGaps.length > 0 && (
        <section>
          <h2 className="analytics-subtitle">📍 What's Missing</h2>
          {data.categoryGaps.map((gap: any, idx: number) => (
            <GapCard 
              key={idx}
              cityType={gap.cityType}
              missingCategories={gap.missingCategories}
            />
          ))}
        </section>
      )}

      {/* Empty state */}
      {(!data.opportunities || data.opportunities.length === 0) &&
       (!data.byCities || data.byCities.length === 0) &&
       (!data.categoryGaps || data.categoryGaps.length === 0) && (
        <div className="empty-state">
          No analytics data available. Add some stores and products to see insights.
        </div>
      )}
    </div>
  );
};
