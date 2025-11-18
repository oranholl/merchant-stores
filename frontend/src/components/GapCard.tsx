interface GapCardProps {
  cityType: string;
  missingCategories: string[];
}

export const GapCard = ({ cityType, missingCategories }: GapCardProps) => {
  return (
    <div className="gap-card">
      <div className="gap-card-title">
        {cityType}
      </div>
      <div className="gap-card-text">
        Missing: {missingCategories.join(', ')}
      </div>
    </div>
  );
};
