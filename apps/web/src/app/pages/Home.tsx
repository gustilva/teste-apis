import { useState } from "react";
import {
    Activity,
    Brain,
    ChevronDown,
    Microscope,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    Pill,
    Download,
    Users,
    LightbulbIcon,
    Clock3,
    BookOpen,
    ClipboardCheck,
    CheckCircle2,
    Heart,
    AlertTriangle
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { StatusCard } from "../components/patient/StatusCard";
import { PatientHeader } from "../components/patient/PatientHeader";
import { ComorbiditySection } from "../components/patient/ComorbiditySection";
import { ProtocolCard } from "../components/patient/ProtocolCard";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

    const protocols = {
        neoadjuvant: [
            {
                name: "TC",
                duration: "4 ciclos | 21 dias/ciclo",
                isFirstChoice: true,
                medications: ["Docetaxel 75mg/m²", "Ciclofosfamida 600mg/m²"],
                responseRate: "78%",
                survivalRate: "24 meses",
                mainEffects: ["Neutropenia", "Alopecia", "Náusea"],
                sideEffects: [
                    {
                        effect: "Neutropenia",
                        timing: "7-10 dias após aplicação",
                        symptoms: "Maior risco de infecções, febre",
                        medication: "Filgrastima (G-CSF) profilático"
                    }
                ]
            },
            {
                name: "AC-T",
                duration: "8 ciclos | 21 dias/ciclo",
                isFirstChoice: false,
                medications: ["Adriamicina 60mg/m²", "Ciclofosfamida 600mg/m²", "Paclitaxel 175mg/m²"],
                responseRate: "82%",
                survivalRate: "28 meses",
                mainEffects: ["Cardiotoxicidade", "Neutropenia", "Neuropatia"],
                sideEffects: [
                    {
                        effect: "Cardiotoxicidade",
                        timing: "Cumulativo",
                        symptoms: "Diminuição da FEVE, dispneia",
                        medication: "Monitoramento cardíaco"
                    }
                ]
            }
        ],
        adjuvant: [
            {
                name: "Sacituzumab",
                duration: "Contínuo até completar ciclos",
                isFirstChoice: true,
                medications: ["Sacituzumab Govitecan 10mg/kg"],
                responseRate: "35%",
                survivalRate: "12 meses",
                mainEffects: ["Neutropenia", "Diarreia", "Fadiga"],
                sideEffects: [
                    {
                        effect: "Neutropenia",
                        timing: "7-14 dias",
                        symptoms: "Risco infeccioso",
                        medication: "G-CSF conforme necessidade"
                    }
                ]
            }
        ]
    };

    const handleProtocolAcceptance = (protocol: string) => {
        setSelectedProtocol(protocol);
        console.log(`Protocolo ${protocol} aceito pelo médico`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
                    <PatientHeader />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                        <StatusCard
                            label="Estadiamento"
                            value="T4N2M1"
                            subvalue="Estadio IV"
                            status="error"
                            icon={Activity}
                        />
                        <StatusCard
                            label="Tipo Tumoral"
                            value="CDI"
                            subvalue="Triplo Negativo"
                            status="warning"
                            icon={Brain}
                        />
                        <StatusCard
                            label="Tamanho"
                            value="7.2 cm"
                            subvalue="Multifocal"
                            status="error"
                            icon={ArrowRight}
                        />
                        <StatusCard
                            label="Linfonodos"
                            value="12/15"
                            subvalue="Positivos, N2"
                            status="error"
                            icon={Microscope}
                        />
                        <StatusCard
                            label="RE/RP"
                            value="RE 0% / RP 0%"
                            subvalue="Negativo"
                            status="error"
                            icon={Brain}
                        />
                        <StatusCard
                            label="HER2"
                            value="IHQ 0"
                            subvalue="Negativo"
                            status="error"
                            icon={Microscope}
                        />
                        <StatusCard
                            label="Ki67"
                            value="80%"
                            subvalue="Alto grau"
                            status="error"
                            icon={AlertCircle}
                        />
                        <StatusCard
                            label="Grau Histológico"
                            value="Grau III"
                            subvalue="Pouco diferenciado"
                            status="error"
                            icon={Activity}
                        />
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 mb-8">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Visão Geral
                        </TabsTrigger>
                        <TabsTrigger value="treatments" className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Tratamentos
                        </TabsTrigger>
                        <TabsTrigger value="monitoring" className="flex items-center gap-2">
                            <Clock3 className="w-4 h-4" />
                            Monitoramento
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Análise de Risco
                        </TabsTrigger>
                        <TabsTrigger value="protocols" className="flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4" />
                            Protocolos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <Card className="p-6">
                                <Accordion type="multiple" className="space-y-4">
                                    <AccordionItem value="history">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-green-600">
                                                <Clock3 className="w-4 h-4" />
                                                Histórico da Doença
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                                <p><span className="font-medium">Diagnóstico:</span> Agosto/2022</p>
                                                <p><span className="font-medium">Metástase:</span> Dezembro/2022</p>
                                                <p><span className="font-medium">Localização Primária:</span> Mama esquerda, multifocal</p>
                                                <p><span className="font-medium">Tipo Histológico:</span> CDI Triplo Negativo</p>
                                                <p><span className="font-medium">Grau:</span> III (pouco diferenciado)</p>
                                                <p><span className="font-medium">Ki67:</span> 80%</p>
                                                <p><span className="font-medium">Sítios Metastáticos:</span> Fígado (3 lesões), Ossos (coluna)</p>
                                                <p><span className="font-medium">Progressão:</span> Última em 15/01/2024</p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="clinical">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-orange-600">
                                                <Brain className="w-4 h-4" />
                                                Status Clínico
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                                <p><span className="font-medium">ECOG:</span> 2 (Sintomática, &gt;50% do tempo em repouso)</p>
                                                <p><span className="font-medium">Karnofsky:</span> 60%</p>
                                                <p><span className="font-medium">Peso:</span> 58kg (perda de 12kg em 6 meses)</p>
                                                <p><span className="font-medium">IMC:</span> 20.3 kg/m²</p>
                                                <p><span className="font-medium">Dor:</span> EVA 6/10 - controlada com opióides</p>
                                                <p><span className="font-medium">Sintomas B:</span> Fadiga, sudorese noturna</p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="alerts">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-red-600">
                                                <AlertTriangle className="w-4 h-4" />
                                                Alertas Importantes
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                                <p className="flex items-center gap-2 text-red-700">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Compressão medular em T8 - necessita avaliação neurocirúrgica
                                                </p>
                                                <p className="flex items-center gap-2 text-red-700">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Hipercalcemia prévia necessitando internação
                                                </p>
                                                <p className="flex items-center gap-2 text-red-700">
                                                    <Heart className="w-4 h-4" />
                                                    Cardiotoxicidade por antraciclicos - FE 45%
                                                </p>
                                                <p className="flex items-center gap-2 text-red-700">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Alto risco de fratura patológica em L3
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="comorbidities">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-purple-600">
                                                <Heart className="w-4 h-4" />
                                                Comorbidades
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium mb-2">Cardiovasculares</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        <li>Cardiopatia por antraciclicos (FE 45%)</li>
                                                        <li>Hipertensão arterial sistêmica</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Endócrinas</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        <li>Diabetes mellitus tipo 2</li>
                                                        <li>Hipotireoidismo em tratamento</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Psiquiátricas</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        <li>Depressão</li>
                                                        <li>Ansiedade</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="allergies">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-yellow-600">
                                                <AlertCircle className="w-4 h-4" />
                                                Alergias
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium mb-2">Medicamentos</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        <li>Penicilina - reação grave</li>
                                                        <li>Sulfas - rash cutâneo</li>
                                                        <li>Dipirona - edema facial</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Contrastes</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        <li>Contraste iodado - reação moderada prévia</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Outras</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        <li>Látex - dermatite de contato</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="treatments">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium mb-6">Linhas de Tratamento</h3>
                            <div className="space-y-8">
                                {/* Primeira Linha */}
                                <div className="relative">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white rounded-lg border p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Primeira Linha - Concluída
                                                </h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-sm text-gray-600">Protocolo:</span>
                                                        <div className="flex gap-2 mt-1">
                                                            <Badge variant="secondary">
                                                                Inibidor de Ciclina
                                                            </Badge>
                                                            <Badge variant="secondary">
                                                                Endocrinoterapia Oral
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Período:</span>
                                                        <p className="text-sm">Jun/2021 - Mar/2022</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-600">Resultado:</span>
                                                        <p className="text-sm">Progressão após 9 meses</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Segunda Linha - Atual */}
                                <div className="relative">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white rounded-lg border p-4 border-blue-200">
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Segunda Linha - Em Andamento
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Brain className="w-4 h-4" />
                                                        <span>Análise Molecular Requerida:</span>
                                                    </div>
                                                    <div className="ml-6 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Microscope className="w-4 h-4 text-purple-500" />
                                                            <span>Teste PIC-3K</span>
                                                            <Badge variant="success">Positivo</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Microscope className="w-4 h-4 text-purple-500" />
                                                            <span>Teste HER2</span>
                                                            <Badge>Fracamente Positivo</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <span className="text-sm text-gray-600">Protocolo Recomendado:</span>
                                                        <div className="flex gap-2 mt-1">
                                                            <Badge variant="secondary">Endocrinoterapia</Badge>
                                                            <Badge variant="secondary">Capivacertib</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Pill className="w-4 h-4 text-blue-500" />
                                                        <span>Iniciado em Abr/2022</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Próximas Linhas - Recomendações */}
                                <div className="relative">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <ArrowRight className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white rounded-lg border p-4 border-gray-200">
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Próximas Linhas - Recomendações
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-sm font-medium">Terceira Linha:</span>
                                                        <div className="mt-1 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline">Opção 1</Badge>
                                                                <span className="text-sm">Trastuzumab Deruxtecan</span>
                                                                <Badge variant="secondary">HER2-low</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline">Opção 2</Badge>
                                                                <span className="text-sm">Endocrinoterapia alternativa</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium">Quarta Linha:</span>
                                                        <div className="mt-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm">Quimioterapia</span>
                                                                <Badge variant="secondary">Após esgotar opções hormonais</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="monitoring">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium mb-6">Checklist Pré-Ciclo</h3>
                            <Accordion type="multiple" className="space-y-4">
                                <AccordionItem value="labs">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Activity className="w-4 h-4" />
                                            Exames Laboratoriais
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium mb-2">Hemograma Completo</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>Neutrófilos &gt; 1500/mm³</li>
                                                    <li>Plaquetas &gt; 100.000/mm³</li>
                                                    <li>Hemoglobina &gt; 10g/dL</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Função Renal</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>Clearance de creatinina estimado</li>
                                                    <li>Ureia e creatinina</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Função Hepática</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>TGO/TGP</li>
                                                    <li>Bilirrubinas</li>
                                                    <li>Fosfatase alcalina</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="cardiac">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2 text-red-600">
                                            <Heart className="w-4 h-4" />
                                            Avaliação Cardíaca
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium mb-2">Monitoramento Regular</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>Ecocardiograma a cada 3 meses</li>
                                                    <li>ECG antes de cada ciclo</li>
                                                    <li>Troponina se sintomas cardíacos</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Sinais de Alerta</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>Dispneia aos esforços</li>
                                                    <li>Edema de membros inferiores</li>
                                                    <li>Precordialgia</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="symptoms">
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <AlertTriangle className="w-4 h-4" />
                                            Sintomas e Toxicidades
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium mb-2">Avaliar</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>Grau de fadiga (ECOG)</li>
                                                    <li>Escala de dor (EVA)</li>
                                                    <li>Náusea/vômitos</li>
                                                    <li>Mucosite</li>
                                                    <li>Neuropatia periférica</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Critérios de Adiamento</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    <li>Toxicidade grau 3 ou 4</li>
                                                    <li>Infecção ativa</li>
                                                    <li>Performance status &gt; 2</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analysis">
                        <div className="space-y-6">
                            {/* Gráfico de Sobrevida */}
                            <Card className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium">Análise de Sobrevida</h3>
                                        <p className="text-sm text-gray-500">Projeção com protocolo atual</p>
                                    </div>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Baixar Relatório
                                    </Button>
                                </div>

                                <div className="h-[300px] mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={[
                                                { mes: 0, atual: 100, projecao: 100 },
                                                { mes: 6, atual: 95, projecao: 95 },
                                                { mes: 12, atual: 88, projecao: 88 },
                                                { mes: 18, atual: 82, projecao: 82 },
                                                { mes: 24, atual: 75, projecao: 75 },
                                                { mes: 30, atual: null, projecao: 70 },
                                                { mes: 36, atual: null, projecao: 65 },
                                                { mes: 42, atual: null, projecao: 60 },
                                                { mes: 48, atual: null, projecao: 55 },
                                            ]}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" label={{ value: 'Meses', position: 'insideBottom', offset: -5 }} />
                                            <YAxis label={{ value: 'Sobrevida (%)', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="atual"
                                                name="Dados Reais"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                dot={{ r: 4 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="projecao"
                                                name="Projeção"
                                                stroke="#9333ea"
                                                strokeDasharray="5 5"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <div className="flex items-start gap-2">
                                        <LightbulbIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-purple-900 mb-1">Insights de IA</h4>
                                            <ul className="space-y-2 text-sm text-purple-800">
                                                <li>• A taxa de sobrevida projetada para 48 meses é de 55%</li>
                                                <li>• A resposta ao tratamento atual está dentro do esperado</li>
                                                <li>• Recomenda-se avaliação de ajuste de protocolo aos 30 meses</li>
                                                <li>• Alto potencial de benefício com terapia-alvo HER2-low</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Análise de Casos Similares */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium">Casos Similares</h3>
                                        <p className="text-sm text-gray-500">Baseado em 128 pacientes com perfil similar</p>
                                    </div>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        89% Compatibilidade
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-600">Distribuição de Tratamentos</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Endocrinoterapia + Inibidor</span>
                                                <Badge variant="outline">68%</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Terapia-alvo HER2</span>
                                                <Badge variant="outline">22%</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Outros protocolos</span>
                                                <Badge variant="outline">10%</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-600">Tempo Médio de Resposta</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Resposta Inicial</span>
                                                <Badge variant="success">2-3 meses</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Progressão Livre</span>
                                                <Badge variant="success">12 meses</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Sobrevida Global</span>
                                                <Badge variant="success">36+ meses</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-600">Desfechos</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Resposta Completa</span>
                                                <Badge variant="success">45%</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Resposta Parcial</span>
                                                <Badge variant="warning">35%</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Progressão</span>
                                                <Badge variant="secondary">20%</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-gray-600">Principais Efeitos Colaterais Reportados</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm">Fadiga (75% dos casos)</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm">Náusea (60% dos casos)</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm">Neutropenia (45% dos casos)</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm">Artralgia (40% dos casos)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button className="w-full flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Baixar Relatório Detalhado
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="protocols">
                        <div className="space-y-6">
                            <Card className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium">Protocolos Recomendados</h3>
                                        <p className="text-sm text-gray-500">Baseado no perfil da paciente e estadiamento</p>
                                    </div>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Brain className="w-4 h-4" />
                                        Recomendação por IA
                                    </Badge>
                                </div>

                                <Accordion type="multiple" className="space-y-4">
                                    <AccordionItem value="neoadjuvant">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-green-600">
                                                <Activity className="w-4 h-4" />
                                                Protocolos de Neoadjuvância
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                {protocols.neoadjuvant.map((protocol) => (
                                                    <ProtocolCard
                                                        key={protocol.name}
                                                        {...protocol}
                                                        selectedProtocol={selectedProtocol}
                                                        onProtocolAcceptance={handleProtocolAcceptance}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="adjuvant">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <Activity className="w-4 h-4" />
                                                Protocolos de Adjuvância
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                {protocols.adjuvant.map((protocol) => (
                                                    <ProtocolCard
                                                        key={protocol.name}
                                                        {...protocol}
                                                        selectedProtocol={selectedProtocol}
                                                        onProtocolAcceptance={handleProtocolAcceptance}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-start gap-2">
                                        <LightbulbIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-blue-900 mb-1">Recomendação Personalizada</h4>
                                            <p className="text-sm text-blue-800">
                                                Baseado no perfil molecular do tumor (Triplo Negativo) e status performance,
                                                o protocolo TC em neoadjuvância apresenta melhor relação risco-benefício para esta paciente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PatientDashboard;
