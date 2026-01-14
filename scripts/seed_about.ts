import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Seeding about/profile data at ${dbPath}...`);

const insertTechStack = db.prepare(`
  INSERT INTO tech_stack (category, categoryNumber, categoryTitle, categoryQuote, toolName, toolIcon, toolDescription, displayOrder) 
  VALUES (@category, @categoryNumber, @categoryTitle, @categoryQuote, @toolName, @toolIcon, @toolDescription, @displayOrder)
`);

const insertExperience = db.prepare(`
  INSERT INTO experience (period, title, company, description, displayOrder) 
  VALUES (@period, @title, @company, @description, @displayOrder)
`);

const insertEducation = db.prepare(`
  INSERT INTO education (period, title, institution, description, displayOrder) 
  VALUES (@period, @title, @institution, @description, @displayOrder)
`);

const insertPageContent = db.prepare(`
  INSERT OR REPLACE INTO page_content (sectionKey, content) 
  VALUES (@sectionKey, @content)
`);

const techStackData = [
  // BIM & Modelagem
  { category: 'bim', categoryNumber: '01', categoryTitle: 'BIM &<br/>Modelagem', categoryQuote: 'O BIM é o alicerce digital que permite a precisão entre o sonho e a execução.', toolName: 'Revit', toolIcon: 'SiAutodesk', toolDescription: 'Coordenação Técnica', displayOrder: 1 },
  { category: 'bim', categoryNumber: '01', categoryTitle: 'BIM &<br/>Modelagem', categoryQuote: 'O BIM é o alicerce digital que permite a precisão entre o sonho e a execução.', toolName: '3ds Max', toolIcon: 'SiAutodesk', toolDescription: 'Modelos Orgânicos', displayOrder: 2 },
  { category: 'bim', categoryNumber: '01', categoryTitle: 'BIM &<br/>Modelagem', categoryQuote: 'O BIM é o alicerce digital que permite a precisão entre o sonho e a execução.', toolName: 'SketchUp', toolIcon: 'SiSketchup', toolDescription: 'Estudo de Massa', displayOrder: 3 },
  
  // Visualização Avançada
  { category: 'render', categoryNumber: '02', categoryTitle: 'Visualização<br/>Avançada', categoryQuote: 'A luz é o pincel que reveals a alma das superfícies arquitetônicas.', toolName: 'Corona', toolIcon: 'FaLayerGroup', toolDescription: 'Fotometria & Textura', displayOrder: 1 },
  { category: 'render', categoryNumber: '02', categoryTitle: 'Visualização<br/>Avançada', categoryQuote: 'A luz é o pincel que reveals a alma das superfícies arquitetônicas.', toolName: 'V-Ray', toolIcon: 'FaCube', toolDescription: 'Cálculo de Iluminação', displayOrder: 2 },
  { category: 'render', categoryNumber: '02', categoryTitle: 'Visualização<br/>Avançada', categoryQuote: 'A luz é o pincel que reveals a alma das superfícies arquitetônicas.', toolName: 'Enscape', toolIcon: 'EnscapeIcon', toolDescription: 'Imersão em Tempo Real', displayOrder: 3 },
  
  // Estratégia Visual
  { category: 'post', categoryNumber: '03', categoryTitle: 'Estratégia<br/>Visual', categoryQuote: 'Comunicar arquitetura é traduzir espaço em narrativa compreensível.', toolName: 'Photoshop', toolIcon: 'SiAdobephotoshop', toolDescription: 'Pós-Produção Atmosférica', displayOrder: 1 },
  { category: 'post', categoryNumber: '03', categoryTitle: 'Estratégia<br/>Visual', categoryQuote: 'Comunicar arquitetura é traduzir espaço em narrativa compreensível.', toolName: 'Illustrator', toolIcon: 'SiAdobeillustrator', toolDescription: 'Diagramação Poética', displayOrder: 2 },
  { category: 'post', categoryNumber: '03', categoryTitle: 'Estratégia<br/>Visual', categoryQuote: 'Comunicar arquitetura é traduzir espaço em narrativa compreensível.', toolName: 'InDesign', toolIcon: 'SiAdobeindesign', toolDescription: 'Design Editorial de Pranchas', displayOrder: 3 },
];

const experienceData = [
  { period: '2024 — Presente', title: 'Estagiário de Projetos', company: 'Silva & Associados Arquitetura', description: 'Desenvolvimento de projetos executivos em Revit, modelagem de famílias paramétricas e compatibilização de projetos complementares.', displayOrder: 1 },
  { period: '2023 — 2024', title: 'Freelance ArchViz Artist', company: 'Autônomo', description: 'Produção de imagens fotorrealistas para lançamentos imobiliários e apresentações de concursos.', displayOrder: 2 },
  { period: '2022', title: 'Monitoria de Geometria Descritiva', company: 'Universidade Federal', description: 'Auxílio aos alunos do primeiro ano na compreensão de projeções ortogonais e sistemas de representação.', displayOrder: 3 },
];

const educationData = [
  { period: '2023 — Presente', title: 'Arquitetura e Urbanismo', institution: 'Universidade [Nome da Universidade]', description: 'Foco em Tecnologia da Construção e Projeto Urbano Sustentável.', displayOrder: 1 },
  { period: '2022', title: 'Certificação Revit Architecture', institution: 'Autodesk Authorized Training Center', description: null, displayOrder: 2 },
];

const pageContentData = [
  { 
    sectionKey: 'about_hero', 
    content: JSON.stringify({
      name: 'José Eugênio',
      subtitle: 'Estudante de Arquitetura & BIM Specialist',
      quote: '"A arquitetura não é sobre concreto e aço, mas sobre a luz que eles capturam e o silêncio que eles guardam."',
      imageUrl: '' // Placeholder for portrait
    })
  },
  {
    sectionKey: 'about_manifesto',
    content: JSON.stringify({
      sectionLabel: 'Abordagem',
      title: 'Minimalismo com<br/>Propósito Humano.',
      paragraph1: 'Atualmente cursando Arquitetura e Urbanismo, minha pesquisa se concentra na intersecção entre a precisão técnica do BIM e a sensibilidade poética do design.',
      paragraph2: 'Acredito que ferramentas digitais como Revit e V-Ray não são apenas meios de representação, mas instrumentos de projeto que nos permitem simular, analisar e refinar a experiência espacial antes mesmo do primeiro tijolo ser assentado.'
    })
  }
];

const runSeed = db.transaction(() => {
  // Clear existing data
  db.exec('DELETE FROM tech_stack');
  db.exec('DELETE FROM experience');
  db.exec('DELETE FROM education');
  
  for (const item of techStackData) insertTechStack.run(item);
  for (const item of experienceData) insertExperience.run(item);
  for (const item of educationData) insertEducation.run(item);
  for (const item of pageContentData) insertPageContent.run(item);
});

try {
  runSeed();
  console.log('Seeding complete.');
} catch (error) {
  console.error('Error seeding database:', error);
}
