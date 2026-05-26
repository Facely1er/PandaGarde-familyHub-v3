import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  GraduationCap,
  Accessibility as UniversalAccess,
  BookOpen,
  Lock,
  Shield,
  School,
  ArrowRight,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { GUIDES_STORIES_NAV_LABEL } from '../data/siteNavigation';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Family-centered',
      description:
        'Privacy education works best when parents and kids talk together. Our stories, guides, and Hub missions are written for that—not as a child social network.',
    },
    {
      icon: GraduationCap,
      title: 'Age-appropriate',
      description:
        'Content is grouped for younger kids, middle childhood, and teens—with language parents can actually use at the dinner table.',
    },
    {
      icon: UniversalAccess,
      title: 'Free to use',
      description:
        'The website and Family Hub are free to use in the browser. Mission progress stays on your device; the core journey does not require a PandaGarde account.',
    },
    {
      icon: BookOpen,
      title: 'Engaging',
      description:
        'Privacy Panda stories, printable activities, and optional missions in Family Hub give families more than a wall of policy text.',
    },
    {
      icon: Lock,
      title: 'Privacy-respecting',
      description:
        'We minimize what we ask for. Family Hub profiles and progress are stored locally on your device—not sold as a monitoring product.',
    },
    {
      icon: Shield,
      title: 'Honest scope',
      description:
        'Footprint review uses apps you list yourself—we do not watch what children do online. We say clearly what is educational vs. what is still in development.',
    },
  ];

  return (
    <PageLayout
      title="About PandaGarde"
      subtitle="We help families learn about online privacy through stories, parent guides, and practice on device—not through surveillance or hype."
      breadcrumbs
    >
      <div className="mx-auto max-w-6xl">
        <section className="mb-16 lg:mb-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                Our mission
              </h2>
              <div className="space-y-5 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  Kids go online early. Parents deserve clear, calm ways to teach privacy—not fear-based
                  lectures or tools that spy on children.
                </p>
                <p>
                  PandaGarde is a free website and Family Hub app: Privacy Panda stories, guides for
                  parents, printables, and age-matched privacy missions families can do together on this
                  device.
                </p>
                <p>
                  We are an education project, not a compliance audit or monitoring service. Our footprint
                  review shows exposure from the apps you choose to list—it does not read medical records
                  or track live activity.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white">
                <Shield size={64} aria-hidden />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Local-first for families
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Learn and practice on your device. You decide what to share and when to explore.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              What we stand for
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              These ideas shape how we write content and build Family Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-8"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white sm:h-20 sm:w-20">
                    <IconComponent size={32} aria-hidden />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-gray-800 lg:order-1">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white">
                <School size={64} aria-hidden />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Schools welcome
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stories and printables can support digital citizenship units—without student accounts on
                PandaGarde.
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                Families first, classrooms too
              </h2>
              <div className="space-y-5 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                <p>
                  Most families use PandaGarde at home: read a story, talk through a guide, or open Family
                  Hub for a short mission.
                </p>
                <p>
                  Educators can adapt our stories, discussion prompts, and downloads where they fit
                  existing lessons. We do not claim full district curriculum or mandatory standards
                  alignment—see{' '}
                  <Link to="/how-it-works" className="font-medium text-green-700 hover:underline dark:text-green-400">
                    How it works
                  </Link>{' '}
                  for what is available today.
                </p>
                <p>
                  Interactive privacy missions and saved progress live in Family Hub on each device—not as
                  a duplicate catalog on the public website.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 lg:mb-20">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800 sm:p-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              How we build
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              PandaGarde is developed as a local-first family privacy education site. We improve content
              based on feedback from families and partners—not through a live social network on the site.
              If something is marked coming soon or redirects elsewhere, we try to say so plainly.
            </p>
          </div>
        </section>

        <section className="text-center">
          <div className="rounded-2xl bg-gradient-to-r from-green-800 via-green-600 to-green-500 p-10 text-white sm:p-14">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Explore PandaGarde</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed opacity-90 sm:text-xl">
              Start with stories and guides, or open Family Hub when you want hands-on missions on this
              device.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/for-families"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-green-700 transition-colors hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-lg"
              >
                {GUIDES_STORIES_NAV_LABEL}
                <ArrowRight size={20} aria-hidden />
              </Link>
              <Link
                to="/family-hub"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 px-6 py-3 text-base font-bold text-white transition-colors hover:bg-white/10 sm:px-8 sm:py-4 sm:text-lg"
              >
                Open Family Hub
                <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
