import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, TrendingUp, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

const featureCards = [
  {
    icon: Eye,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'See Risks',
    description:
      "Get a clear view of your family's privacy status from the apps and services you list in your catalog—not from monitoring their devices.",
    bullets: [
      'List apps and sites your family uses (self-reported)',
      'See privacy risk scores per service from Digital Footprint Analysis',
      'Catalog notifications and RSS headlines when feeds load',
    ],
  },
  {
    icon: Shield,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Take Action',
    description:
      "Don't just see the problems—get clear next steps: privacy setting guides, Family Hub missions, and catalog reminders for services you listed.",
    bullets: [
      'Mark services requested, approved, or denied in your catalog (planning)',
      'Get step-by-step privacy setting guides',
      'Open Family Hub for age-matched missions and family talks',
    ],
  },
  {
    icon: TrendingUp,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: 'Stay Informed',
    description:
      "Get conversation starters, track your family's privacy progress, and stay up-to-date with tips and resources designed specifically for parents.",
    bullets: [
      'Get ready-to-use conversation starters',
      "Track your family's privacy improvements",
      'Access parent guides and resources',
    ],
  },
] as const;

const ParentLandingPage: React.FC = () => {
  const faqs = [
    {
      question: 'How do I see what my children do online?',
      answer:
        'Family Hub does not monitor children’s devices. You add the apps and services your family uses (or complete Digital Footprint Analysis on the website), then review privacy risk scores and guided next steps for those services.',
    },
    {
      question: 'What is a privacy risk score?',
      answer:
        "A simple number that shows how safe your child's privacy is with each app or website. Lower is safer, higher means more risk. We explain what each score means in plain language.",
    },
    {
      question: 'Do I need to be tech-savvy to use this?',
      answer:
        "Not at all! Everything is designed for parents who aren't tech experts. We use simple language and clear explanations, not technical jargon.",
    },
    {
      question: 'How do conversation starters help?',
      answer:
        'We provide ready-to-use questions and topics based on what your children are actually using online, so you know exactly what to talk about and how to start the conversation.',
    },
    {
      question: "Is my family's information safe?",
      answer:
        "Yes. Family Hub is local-first: family profiles and mission progress stay on your device. Sensitive fields can be encrypted in the browser when supported. We do not require a server account for the core journey.",
    },
  ];

  return (
    <main id="main-content">
      <section className="marketing-hero">
        <div className="container">
          <div className="fade-in text-center">
            <h1 className="marketing-heading text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100">
              For Parents: Keep Your Family Safe Online
            </h1>
            <p className="marketing-lead text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple tools to see what your children do online, understand their privacy risks, and get help
              talking to them about staying safe.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/family-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-marketing-primary"
              >
                <Shield size={20} />
                Start Protecting Your Family
                <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="btn-marketing-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="container">
          <div className="marketing-grid">
            {featureCards.map(({ icon: Icon, iconBg, iconColor, title, description, bullets }) => (
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl text-gray-800 dark:text-gray-100">Your Privacy Dashboard</h2>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              See everything you need to know about your family&apos;s online privacy in one simple dashboard.
            </p>
          </div>

          <div className="rounded-card border-2 border-dashed border-gray-300 dark:border-gray-600 bg-light dark:bg-gray-200/50 p-6 sm:p-8">
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { value: '85', label: 'Family Privacy Score', color: 'text-success' },
                { value: '3', label: 'Action Items', color: 'text-amber-500' },
                { value: '2', label: 'Children', color: 'text-blue-600' },
              ].map(({ value, label, color }) => (
                <div key={label} className="rounded-lg bg-surface p-6 text-center">
                  <div className={`mb-2 text-4xl font-bold ${color}`}>{value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/family-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-success px-8 py-4 text-lg font-bold text-white no-underline"
              >
                <Shield size={20} />
                Access Your Dashboard
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl text-gray-800 dark:text-gray-100">Common Questions from Parents</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Everything you need to know to get started</p>
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
              See All Questions
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 py-16 text-center text-white">
        <div className="container">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold">Ready to Protect Your Family?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg sm:text-xl px-4">
            Keep your family safe online with simple, easy-to-use tools designed for parents who want to protect
            their children&apos;s privacy.
          </p>
          <Link
            to="/family-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-10 py-5 text-xl font-bold text-indigo-500 no-underline"
          >
            <Shield size={24} />
            Start Protecting Your Family Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ParentLandingPage;
