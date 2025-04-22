
import { Heart, AlertTriangle, Pill } from "lucide-react";

export const ComorbiditySection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          Comorbidades
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-red-700">Cardiopatia por Antraciclicos</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-700">Depressão</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-700">Hipercalcemia</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
          <Pill className="w-4 h-4 text-blue-500" />
          Medicações Atuais
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
            <Pill className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700">Sacituzumabe Govitecana 10mg/kg</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
            <Pill className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700">Ácido Zoledrônico 4mg/mês</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
            <Pill className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700">Morfina 30mg 4/4h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
