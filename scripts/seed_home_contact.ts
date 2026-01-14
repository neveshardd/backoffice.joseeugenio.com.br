import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'backoffice.db');
const db = new Database(dbPath);

console.log(`Seeding contact and home data at ${dbPath}...`);

const insertPageContent = db.prepare(`
  INSERT OR REPLACE INTO page_content (sectionKey, content) 
  VALUES (@sectionKey, @content)
`);

const contactAndHomeData = [
  { 
    sectionKey: 'home_hero', 
    content: JSON.stringify({
      title: 'Arquitetura<br />do Silêncio',
      subtitle: 'Moldando o vazio. Esculpindo a luz.',
      ctaText: 'Ver Portfólio Completo',
      ctaLink: '/projetos',
      imageSrc: '/hero.jpg'
    })
  },
  {
    sectionKey: 'home_about_preview',
    content: JSON.stringify({
      label: 'O Perfil',
      heading: 'A atemporalidade<br/>é minha busca<br/>constante.',
      paragraph1: 'Acredito que a arquitetura é a arte de emoldurar o vazio. Em um mundo saturado de ruído visual, busco o silêncio. Meu trabalho acadêmico é definido pela pesquisa da honestidade dos materiais — concreto aparente, aço bruto e vidro límpido.',
      paragraph2: 'Como estudante de arquitetura, cada projeto é um exercício de diálogo entre a estrutura e o ambiente. Não projeto no terreno; projeto <em>com</em> o terreno.',
      ctaText: 'Conheça Minha Trajetória',
      ctaLink: '/sobre'
    })
  },
  {
    sectionKey: 'home_contact',
    content: JSON.stringify({
      label: 'Vamos Conversar?',
      heading: 'Pronto para<br/>Iniciar um Projeto?',
      description: 'Se você tem uma ideia, um terreno ou apenas curiosidade sobre como a arquitetura pode transformar seu espaço, vamos conversar.',
      ctaText: 'Entrar em Contato',
      ctaLink: '/contato'
    })
  },
  {
    sectionKey: 'contact_info',
    content: JSON.stringify({
      label: 'Vamos Conversar?',
      heading: 'Entre em Contato',
      description: 'Estou disponível para estágios, parcerias acadêmicas ou projetos freelance de visualização arquitetônica (Renderização e Modelagem 3D).',
      email: 'contact@joseeugenio.com.br',
      whatsapp: '5500000000000',
      linkedin: '#',
      instagram: '#',
      behance: '#'
    })
  }
];

try {
  for (const item of contactAndHomeData) {
    insertPageContent.run(item);
  }
  console.log('Contact and Home data seeded successfully.');
} catch (error) {
  console.error('Error seeding contact/home data:', error);
}
