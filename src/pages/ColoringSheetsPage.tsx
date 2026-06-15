import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Palette, Printer, Star } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { PageContent } from '../components/layout/PageContent';
import { pdfService } from '../lib/pdfService';
import { logger } from '../lib/logger';

type ColoringSheet = {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  printUrl: string;
  svgUrl: string;
};

const COLORING_SHEETS: ColoringSheet[] = [
  {
    id: 'privacy-panda-basic',
    title: 'Privacy Panda — Basic',
    description: 'Simple outline of Privacy Panda for younger children.',
    ageGroup: 'Ages 5–7',
    difficulty: 'Easy',
    image: '/images/coloring/privacy-panda-basic.svg',
    printUrl: '/downloads/coloring-sheets.html#privacy-panda-basic',
    svgUrl: '/images/coloring/privacy-panda-basic.svg',
  },
  {
    id: 'privacy-shield',
    title: 'Privacy Shield',
    description: 'Design your own privacy protection shield.',
    ageGroup: 'Ages 6–9',
    difficulty: 'Easy',
    image: '/images/coloring/privacy-shield.svg',
    printUrl: '/downloads/coloring-sheets.html#privacy-shield',
    svgUrl: '/images/coloring/privacy-shield.svg',
  },
  {
    id: 'password-treasure',
    title: 'Password Treasure Chest',
    description: 'Color the treasure chest that keeps passwords safe.',
    ageGroup: 'Ages 7–10',
    difficulty: 'Medium',
    image: '/images/coloring/password-treasure.svg',
    printUrl: '/downloads/coloring-sheets.html#password-treasure',
    svgUrl: '/images/coloring/password-treasure.svg',
  },
  {
    id: 'digital-footprint',
    title: 'Digital Footprint Map',
    description: 'Trace your digital journey and learn about online privacy.',
    ageGroup: 'Ages 8–12',
    difficulty: 'Medium',
    image: '/images/coloring/digital-footprint.svg',
    printUrl: '/downloads/coloring-sheets.html#digital-footprint',
    svgUrl: '/images/coloring/digital-footprint.svg',
  },
  {
    id: 'privacy-garden',
    title: 'Privacy Garden',
    description: 'Garden scene with privacy-themed elements.',
    ageGroup: 'Ages 6–11',
    difficulty: 'Easy',
    image: '/images/coloring/privacy-garden.svg',
    printUrl: '/downloads/coloring-sheets.html#privacy-garden',
    svgUrl: '/images/coloring/privacy-garden.svg',
  },
  {
    id: 'cyber-safety-scene',
    title: 'Cyber Safety Scene',
    description: 'Scene showing safe and unsafe online behaviors.',
    ageGroup: 'Ages 9–12',
    difficulty: 'Hard',
    image: '/images/coloring/cyber-safety-scene.svg',
    printUrl: '/downloads/coloring-sheets.html#cyber-safety-scene',
    svgUrl: '/images/coloring/cyber-safety-scene.svg',
  },
];

const DIFFICULTY_CLASS: Record<ColoringSheet['difficulty'], string> = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-200',
  Medium: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  Hard: 'bg-rose-100 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200',
};

const ColoringSheetsPage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!previewId) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewId]);

  const previewSheet = previewId ? COLORING_SHEETS.find((sheet) => sheet.id === previewId) : null;

  const openPrintView = (sheet: ColoringSheet): void => {
    window.open(sheet.printUrl, '_blank', 'noopener,noreferrer');
  };

  const downloadSvg = (sheet: ColoringSheet): void => {
    try {
      const link = document.createElement('a');
      link.href = sheet.svgUrl;
      link.download = `${sheet.id}.svg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      logger.error('Error downloading SVG:', error);
      alert('Error downloading coloring sheet. Please try again.');
    }
  };

  const handleDownloadAll = async (): Promise<void> => {
    setIsDownloading(true);
    try {
      await pdfService.generateColoringSheetsPDF();
    } catch (error) {
      logger.error('Error downloading coloring sheets:', error);
      alert('Error generating the coloring sheets PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageLayout
      title="Privacy Panda Coloring Sheets"
      subtitle="Printable letter-size coloring pages featuring Privacy Panda and privacy concepts — sized for real crayons, not tiny thumbnails."
      breadcrumbs
    >
      <PageContent className="coloring-sheets-page">
        <section className="coloring-sheets-page__intro">
          <h2 className="coloring-sheets-page__intro-title">Creative learning through coloring</h2>
          <p className="coloring-sheets-page__intro-lead">
            Each sheet opens in a full-page print view. Preview larger below, then print on US Letter paper (8.5&quot; × 11&quot;).
          </p>

          <div className="coloring-sheets-page__tips">
            <h3 className="coloring-sheets-page__tips-title">Coloring tips for parents and educators</h3>
            <ul className="coloring-sheets-page__tips-grid">
              {[
                ['Discuss while coloring', 'Talk about the privacy idea in each picture.'],
                ['Display finished art', 'Hang completed sheets as gentle privacy reminders.'],
                ['Use quality paper', 'Print on heavier paper for crayons and markers.'],
                ['Make it social', 'Color together as a calm family activity.'],
              ].map(([title, detail]) => (
                <li key={title} className="coloring-sheets-page__tip">
                  <Star className="coloring-sheets-page__tip-icon" size={18} aria-hidden />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{title}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="coloring-sheets-page__grid">
          {COLORING_SHEETS.map((sheet) => (
            <article key={sheet.id} className="coloring-sheets-page__card">
              <button
                type="button"
                className="coloring-sheets-page__preview"
                onClick={() => setPreviewId(sheet.id)}
                aria-label={`Preview ${sheet.title} full size`}
              >
                <img
                  src={sheet.image}
                  alt=""
                  className="coloring-sheets-page__preview-image"
                  loading="lazy"
                />
              </button>

              <div className="coloring-sheets-page__card-body">
                <div className="coloring-sheets-page__card-head">
                  <h3 className="coloring-sheets-page__card-title">{sheet.title}</h3>
                  <span className="coloring-sheets-page__size-badge">8.5&quot; × 11&quot;</span>
                </div>

                <div className="coloring-sheets-page__meta">
                  <span className={`coloring-sheets-page__difficulty ${DIFFICULTY_CLASS[sheet.difficulty]}`}>
                    {sheet.difficulty}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{sheet.ageGroup}</span>
                </div>

                <p className="coloring-sheets-page__card-desc">{sheet.description}</p>

                <div className="coloring-sheets-page__actions">
                  <button
                    type="button"
                    onClick={() => openPrintView(sheet)}
                    className="button button-primary inline-flex flex-1 items-center justify-center gap-2"
                  >
                    <Printer size={16} aria-hidden />
                    View &amp; print
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSvg(sheet)}
                    className="button button-secondary inline-flex items-center justify-center gap-2 px-4"
                    title="Download SVG"
                  >
                    <Download size={16} aria-hidden />
                    <span className="sr-only">Download SVG for {sheet.title}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="coloring-sheets-page__bulk">
          <h2 className="text-xl font-bold sm:text-2xl">Download the complete set</h2>
          <p className="mt-2 text-green-50/95">
            Get all six sheets in one PDF — same large layouts as the printable HTML pack.
          </p>
          <button
            type="button"
            onClick={() => void handleDownloadAll()}
            disabled={isDownloading}
            className="button button-secondary mt-5 inline-flex items-center gap-2 bg-white text-green-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Download size={18} aria-hidden />
            {isDownloading ? 'Generating PDF…' : 'Download PDF pack'}
          </button>
        </section>

        <section className="coloring-sheets-page__related">
          <h2 className="text-center text-xl font-bold text-green-700 dark:text-green-400 sm:text-2xl">
            Related resources
          </h2>
          <div className="coloring-sheets-page__related-grid">
            <Link to="/stories/privacy-panda-and-the-digital-bamboo-forest" className="coloring-sheets-page__related-card">
              <Palette size={22} className="text-purple-600 dark:text-purple-400" aria-hidden />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Privacy Panda story</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Read the story behind these sheets.</p>
            </Link>
            <Link to="/downloads/safety-posters" className="coloring-sheets-page__related-card">
              <ExternalLink size={22} className="text-amber-600 dark:text-amber-400" aria-hidden />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Safety posters</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Classroom-ready privacy posters.</p>
            </Link>
            <Link to="/for-families" className="coloring-sheets-page__related-card">
              <Star size={22} className="text-green-600 dark:text-green-400" aria-hidden />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Guides &amp; stories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">More printables and parent guides.</p>
            </Link>
          </div>
        </section>

        {previewSheet ? (
          <div
            className="coloring-sheets-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coloring-preview-title"
            onClick={() => setPreviewId(null)}
          >
            <div
              className="coloring-sheets-page__modal-panel"
              onClick={(event) => event.stopPropagation()}
              role="document"
            >
              <header className="coloring-sheets-page__modal-head">
                <h2 id="coloring-preview-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {previewSheet.title}
                </h2>
                <button
                  type="button"
                  className="button button-secondary px-3 py-1.5 text-sm"
                  onClick={() => setPreviewId(null)}
                >
                  Close
                </button>
              </header>
              <div className="coloring-sheets-page__modal-art">
                <img src={previewSheet.image} alt={previewSheet.title} className="coloring-sheets-page__modal-image" />
              </div>
              <div className="coloring-sheets-page__modal-actions">
                <button
                  type="button"
                  className="button button-primary inline-flex items-center gap-2"
                  onClick={() => openPrintView(previewSheet)}
                >
                  <Printer size={16} aria-hidden />
                  Open print view
                </button>
                <button
                  type="button"
                  className="button button-secondary inline-flex items-center gap-2"
                  onClick={() => downloadSvg(previewSheet)}
                >
                  <Download size={16} aria-hidden />
                  Download SVG
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </PageContent>
    </PageLayout>
  );
};

export default ColoringSheetsPage;
