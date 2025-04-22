
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
  ChevronDown,
  Calendar,
  Users
} from "lucide-react";

export const PatientHeader = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-2 rounded-full">
            <Users className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Jeniffer Aniston
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-gray-500">
                #942731
              </Badge>
              <Badge variant="destructive">Câncer Metastático</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            62 anos
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Dados Pessoais
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Informações Pessoais</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <p><span className="font-medium">Nome Completo:</span> Maria Helena Santos</p>
                <p><span className="font-medium">Data de Nascimento:</span> 12/05/1961</p>
                <p><span className="font-medium">CPF:</span> ***.***.***-**</p>
                <p><span className="font-medium">Naturalidade:</span> São Paulo/SP</p>
                <p><span className="font-medium">Estado Civil:</span> Casada</p>
                <p><span className="font-medium">Convênio:</span> SulAmérica</p>
                <p><span className="font-medium">Contato:</span> (11) 98765-4321</p>
                <p><span className="font-medium">Email:</span> maria.helena@email.com</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
