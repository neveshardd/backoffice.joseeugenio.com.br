import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Seeding database at ${dbPath}...`);

// Clear existing data to avoid duplicates if run multiple times (optional, but good for idempotent)
// db.exec('DELETE FROM services');
// db.exec('DELETE FROM work_process');
// db.exec('DELETE FROM faq');
// db.exec('DELETE FROM bim_features');
// db.exec('DELETE FROM page_content');

const insertService = db.prepare('INSERT INTO services (title, description, tags, icon) VALUES (@title, @description, @tags, @icon)');
const insertProcess = db.prepare('INSERT INTO work_process (num, title, description) VALUES (@num, @title, @description)');
const insertFAQ = db.prepare('INSERT INTO faq (question, answer) VALUES (@question, @answer)');
const insertBIM = db.prepare('INSERT INTO bim_features (title, description) VALUES (@title, @description)');
const insertContent = db.prepare('INSERT OR REPLACE INTO page_content (sectionKey, content) VALUES (@sectionKey, @content)');

const services = [
  { title: "Projeto Arquitetônico", description: "Concepção completa do espaço. Do estudo preliminar de volumetria ao detalhamento executivo rigoroso, focando na experiência espacial.", tags: "Residencial • Comercial", icon: "FaDraftingCompass" },
  { title: "Projetos Hidrossanitários", description: "Dimensionamento eficiente de água fria, quente e esgoto. Soluções focadas em sustentabilidade e facilidade de manutenção futura.", tags: "Água • Esgoto • Reuso", icon: "FaWater" },
  { title: "Gestão de Águas Pluviais", description: "Sistemas inteligentes de drenagem e calhas. Protegendo a edificação contra infiltrações e aproveitando recursos naturais.", tags: "Drenagem • Cisternas", icon: "FaHardHat" },
  { title: "Manual do Proprietário", description: "Documentação técnica detalhada para entrega de chaves. Valorização do imóvel com instruções claras de uso e manutenção.", tags: "Documentação • Garantias", icon: "FaFileContract" },
  { title: "Levantamento & As-Built", description: "Digitalização precisa do construído. Utilização de trena a laser e modelagem BIM para reformas e retrofits seguros.", tags: "BIM • Medição Laser", icon: "FaRulerCombined" },
  { title: "Projeto de Instalações", description: "Compatibilização total entre estrutura e instalações prediais, evitando surpresas e custos extras durante a obra.", tags: "Compatibilização • MEP", icon: "FaToilet" }
];

const workProcess = [
  { num: "01", title: "Briefing & Diagnóstico", description: "Reunião inicial para entender suas necessidades, orçamento e análise do terreno/imóvel." },
  { num: "02", title: "Estudo Preliminar", description: "Primeiros traços, volumetria e layout. Aqui definimos a alma do projeto." },
  { num: "03", title: "Anteprojeto & BIM", description: "Modelagem detalhada em 3D, definição de materiais e compatibilização inicial." },
  { num: "04", title: "Projeto Executivo", description: "Detalhamento técnico completo para obra: plantas, cortes, ampliações e memoriais." }
];

const faqs = [
  { question: "O que é um Projeto Executivo?", answer: "É o manual de instruções da sua obra. Contém todos os detalhes técnicos necessários para que o construtor execute exatamente o que foi planejado, evitando erros e desperdícios." },
  { question: "Você realiza acompanhamento de obra?", answer: "Sim, ofereço visitas técnicas programadas para verificar se a execução está fiel ao projeto e para tirar dúvidas da equipe de obra." },
  { question: "Quais cidades você atende?", answer: "Atendo presencialmente em [Sua Cidade] e realizo projetos em todo o Brasil de forma remota, com reuniões online e metodologia adaptada." },
  { question: "Como funciona o pagamento?", answer: "O pagamento é dividido conforme as etapas do projeto, garantindo segurança para ambas as partes. Aceito parcelamento e transferência bancária." }
];

const bimFeatures = [
  { title: "Quantitativos Precisos", description: "Extração automática de materiais, reduzindo o desperdício em obra e estourou de orçamento." },
  { title: "Compatibilização", description: "Sistemas estruturais, elétricos e hidráulicos integrados para evitar surpresas na execução." },
  { title: "Visualização Real", description: "Entenda seu projeto em 3D e passeie por ele antes mesmo de começar a construir." },
  { title: "Documentação Viva", description: "Qualquer alteração na planta atualiza automaticamente cortes e vistas." }
];

const pageContent = [
  { 
    sectionKey: "services_hero", 
    content: JSON.stringify({
      title: "Excelência Técnica<br />& Precisão BIM",
      description: "Transformando necessidades em soluções construtivas através de uma metodologia integrada. Cada linha desenhada carrega informação, custo e especificação.",
      buttonText: "Solicitar Proposta",
      buttonLink: "/contato"
    })
  },
  {
    sectionKey: "services_cta",
    content: JSON.stringify({
      title: "Pronto para iniciar seu projeto?",
      description: "Entre em contato para agendar uma conversa inicial sem compromisso. Vamos transformar suas ideias em arquitetura.",
      buttonText: "Solicitar Orçamento",
      buttonLink: "/contato"
    })
  },
  {
    sectionKey: "bim_intro",
    content: JSON.stringify({
      section_label: "Diferencial Técnico",
      title: "Tecnologia BIM",
      description: "Não entrego apenas desenhos. Entrego a construção virtual da sua obra antes do primeiro tijolo ser assentado."
    })
  }
];

const runSeed = db.transaction(() => {
  // Check if empty before seeding to avoid duplicates, or just clean first. 
  // For safety in this context, I'll delete first.
  db.exec('DELETE FROM services');
  db.exec('DELETE FROM work_process');
  db.exec('DELETE FROM faq');
  db.exec('DELETE FROM bim_features');
  db.exec('DELETE FROM page_content');

  for (const s of services) insertService.run(s);
  for (const w of workProcess) insertProcess.run(w);
  for (const f of faqs) insertFAQ.run(f);
  for (const b of bimFeatures) insertBIM.run(b);
  for (const p of pageContent) insertContent.run(p);
});

try {
  runSeed();
  console.log('Seeding complete.');
} catch (error) {
  console.error('Error seeding database:', error);
}
