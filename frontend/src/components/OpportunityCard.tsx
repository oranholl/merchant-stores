interface OpportunityCardProps {
  category: string;
  cityType: string;
  reason: string;
}

export const OpportunityCard = ({ category, cityType, reason }: OpportunityCardProps) => {
  return (
    <div className="opportunity-card">
      <div className="opportunity-card-title">
        Open a {category} store in {cityType} area
      </div>
      <div className="opportunity-card-text">
        {reason}
      </div>
    </div>
  );
};
