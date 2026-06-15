import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, TrendingUp, ArrowRight, CheckCircle, HelpCircle, BookOpen } from 'lucide-react';

const featureCards = [
  {
    icon: BookOpen,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Start with a story',
    description:
      'Read Privacy Panda with your child—no account, no setup. One story takes about 5 minutes.',
    bullets: [
      'Pick a story matched to your child\'s age',
      'Read together on any phone, tablet, or computer',
      'Use it as a calm way to start privacy talks',
    ],
    cta: { label: 'Browse stories', href: '/stories' },
  },
  {
    icon: Eye,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'List your family\'s apps',
    description:
      'Tell us which apps and websites your family uses. We do not watch their devices—you choose what to add.',
    bullets: [
      'Tap the apps your kids use (school, games, social, health)',
      'See a simple privacy score for each one',
      'Find out which apps are worth a family conversation',
    ],
    cta: { label: 'Add your apps', href: '/service-catalog' },
  },
  {
    icon: Shield,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Practice together in Family Hub',
    description:
      'Short privacy missions for ages 5–17. You do them together; progress stays on your device.',
    bullets: [
      'Age-matched missions with real-life scenarios',
      'Family talk prompts and one practical action each',
      'No child social network and no server account required',
    ],
    cta: { label: 'Open Family Hub', href: '/family-hub' },
  },
] as const;

const ParentLandingPage: React.FC = () => {
  const faqs = [
    {
      question: 'Do you watch what my kids do on their phones?',
      answer:
        'No. PandaGarde does not monitor devices. You list the apps your family uses, and we show privacy scores and conversation starters for those apps.',
    },
    {
      question: 'What is a privacy risk score?',
      answer:
        'A simple number for each app you listed. Lower is safer; higher means the app may collect more personal data. We explain each score in plain language.',
    },
    {
      question: 'Do I need to be tech-savvy?',
      answer:
        'No. Start with a story, or tap the apps your family uses. Every page tells you the one thing to do next.',
    },
    {
      question: 'Where should I start if I only have 5 minutes?',
      answer:
        'Open Privacy Panda stories and read one scene with your child. You can list apps or open Family Hub whenever you have more time.',
    },
    {
      question: 'Is my family\'s information safe?',
      answer:
        'Your profiles and progress stay on your device. We do not require a PandaGarde account for stories, the app list, or Family Hub missions.',
    },
  ];

  return (
    <main id="main-content">
      <section className="marketing-hero">
        <div className="container">
          <div className="fade-in text-center">
            <h1 className="marketing-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100">
              Help your family stay safer online—without being a tech expert
            </h1>
            <p className="marketing-lead text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Read a story with your child, list the apps your family uses, then see which ones deserve a
              conversation. Start anywhere—you do not need to do everything today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/stories" className="btn-marketing-primary">
                <BookOpen size={20} />
                Read a story (5 min)
                <ArrowRight size={16} />
              </Link>
              <Link to="/service-catalog" className="btn-marketing-outline">
                List your family&apos;s apps
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="container">
          <div className="marketing-grid">
            {featureCards.map(({ icon: Icon, iconBg, iconColor, title, description, bullets, cta }) => (
              <article key={title} className="marketing-card">
                <div className={`icon-circle ${iconBg}`}>
                  <Icon size={32} className={iconColor} />
                </div>
                <h2 className="mb-4 text-2xl sm:text-3xl text-gray-800 dark:text-gray-100">{title}</h2>
                <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">{description}</p>
                <ul className="list-none space-y-3 p-0 text-gray-600 dark:text-gray-400">
                  {bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle size={20} className="mt-0.5 shrink-0 text-success" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={cta.href}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-green-700 no-underline hover:underline dark:text-green-400"
                >
                  {cta.label}
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl text-gray-800 dark:text-gray-100">Your next step</h2>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              Pick one path below. You can come back for the others anytime.
            </p>
          </div>

          <div className="rounded-card border-2 border-dashed border-gray-300 dark:border-gray-600 bg-light dark:bg-gray-200/50 p-6 sm:p-8">
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { label: 'Read together', href: '/stories', detail: '5 minutes, no setup' },
                { label: 'List your apps', href: '/service-catalog', detail: 'Tap what your family uses' },
                { label: 'Family Hub missions', href: '/family-hub', detail: 'Practice on this device' },
              ].map(({ label, href, detail }) => (
                <Link
                  key={href}
                  to={href}
                  className="rounded-lg bg-surface p-6 text-center no-underline transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 text-lg font-bold text-green-700 dark:text-green-400">{label}</div>
                  <div className="text-gray-600 dark:text-gray-400">{detail}</div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-lg bg-success px-8 py-4 text-lg font-bold text-white no-underline"
              >
                <TrendingUp size={20} />
                See how it all fits together
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl text-gray-800 dark:text-gray-100">Common questions</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Short answers—no privacy-policy language</p>
          </div>

          <div className="mx-auto max-w-3xl">
            {faqs.map((faq) => (
              <article key={faq.question} className="mb-4 rounded-lg bg-surface dark:bg-gray-200 p-6 shadow-card">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <HelpCircle size={24} className="mt-0.5 shrink-0 text-success" aria-hidden />
                  <div>
                    <h3 className="mb-3 text-lg sm:text-xl text-gray-800 dark:text-gray-100">{faq.question}</h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-lg font-bold text-success no-underline"
            >
              See all questions
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 py-16 text-center text-white">
        <div className="container">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold">Ready when you are</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg sm:text-xl px-4">
            Start with a 5-minute story, or list the apps your family uses. Both work on their own.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-10 py-5 text-xl font-bold text-indigo-500 no-underline"
            >
              <BookOpen size={24} />
              Read a story
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/service-catalog"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-10 py-5 text-xl font-bold text-white no-underline"
            >
              List your apps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ParentLandingPage;
