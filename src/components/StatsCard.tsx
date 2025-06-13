type Props = {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
};

export default function StatsCard({ label, value, icon, bg }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
      <div className={`rounded-full p-2 ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
