interface CityData {
  city: string;
  storeCount: number;
  categories: { category: string }[];
}

interface MarketTableProps {
  cities: CityData[];
}

export const MarketTable = ({ cities }: MarketTableProps) => {
  return (
    <table className="market-table">
      <thead>
        <tr>
          <th>City</th>
          <th className="text-center">Stores</th>
          <th>Categories</th>
        </tr>
      </thead>
      <tbody>
        {cities.map((city) => (
          <tr key={city.city}>
            <td className="font-medium">{city.city}</td>
            <td className="text-center">{city.storeCount}</td>
            <td>
              {city.categories.slice(0, 3).map((cat) => cat.category).join(', ')}
              {city.categories.length > 3 && '...'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
