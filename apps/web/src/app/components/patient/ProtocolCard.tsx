
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export interface ProtocolCardProps {
  name: string;
  duration: string;
  isFirstChoice: boolean;
  medications: string[];
  responseRate: string;
  survivalRate: string;
  mainEffects: string[];
  sideEffects: {
    effect: string;
    timing: string;
    symptoms: string;
    medication: string;
  }[];
  selectedProtocol: string | null;
  onProtocolAcceptance: (protocol: string) => void;
}

export const ProtocolCard = ({
  name,
  duration,
  isFirstChoice,
  medications,
  responseRate,
  survivalRate,
  mainEffects,
  sideEffects,
  selectedProtocol,
  onProtocolAcceptance
}: ProtocolCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-medium">{name}</h4>
          <p className="text-sm text-gray-500">{duration}</p>
        </div>
        {isFirstChoice && (
          <Badge variant="outline" className="bg-green-50 border-green-200">
            1ª Escolha
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline" className="w-full flex justify-between px-3 py-1">
            <span>Taxa de Resposta</span>
            <span className="font-medium">{responseRate}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex-1 justify-center">
            {medications[0]}
          </Badge>
          {medications.length > 1 && (
            <Badge variant="secondary" className="px-2">
              +{medications.length - 1}
            </Badge>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Info className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes do Protocolo {name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Medicações</h5>
                <div className="flex flex-wrap gap-2">
                  {medications.map((med, index) => (
                    <Badge key={index} variant="secondary">
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Taxa de Resposta</span>
                  <p className="font-medium">{responseRate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Sobrevida Média</span>
                  <p className="font-medium">{survivalRate}</p>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Principais Efeitos</h5>
                <div className="flex flex-wrap gap-2">
                  {mainEffects.map((effect, index) => (
                    <Badge key={index} variant="destructive">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Manejo dos Efeitos Colaterais</h5>
                <div className="space-y-3">
                  {sideEffects.map((effect, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium text-sm">{effect.effect}</p>
                      <p className="text-sm text-gray-600 mt-1">Timing: {effect.timing}</p>
                      <p className="text-sm text-gray-600">Sintomas: {effect.symptoms}</p>
                      <p className="text-sm text-gray-600">Manejo: {effect.medication}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          className="w-full"
          variant={selectedProtocol === name ? "secondary" : "default"}
          onClick={() => onProtocolAcceptance(name)}
        >
          {selectedProtocol === name ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <AlertTriangle className="w-4 h-4 mr-2" />
          )}
          {selectedProtocol === name ? "Protocolo Aceito" : "Aceitar"}
        </Button>
      </div>
    </Card>
  );
};
