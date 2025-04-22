
import { Badge } from "../ui/badge.tsx";

interface StatusCardProps {
  label: string;
  value: string;
  subvalue?: string;
  status: "success" | "warning" | "error";
  icon?: React.ElementType;
}

export const StatusCard = ({
  label,
  value,
  subvalue,
  status,
  icon: Icon,
}: StatusCardProps) => {
  const statusColors = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className={`rounded-lg border p-4 ${statusColors[status]} bg-opacity-50 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-2">
        {Icon && <Icon className="w-5 h-5 opacity-70" />}
        <Badge variant={status === "success" ? "success" : status === "warning" ? "warning" : "destructive"} className="text-xs">
          {status === "success" ? "Normal" : status === "warning" ? "Atenção" : "Crítico"}
        </Badge>
      </div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      {subvalue && <p className="text-sm mt-1 opacity-80">{subvalue}</p>}
    </div>
  );
};
