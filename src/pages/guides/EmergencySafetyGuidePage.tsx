import React from 'react';
import { AlertTriangle, Phone, Scale, Shield, Users } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

const cardClass =
  'rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800';
const headingClass = 'mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100';
const subheadingClass = 'mb-3 text-xl font-bold text-gray-900 dark:text-gray-100';
const labelClass = 'mb-2 font-semibold text-gray-900 dark:text-gray-100';
const bodyListClass = 'space-y-2 text-sm text-gray-600 dark:text-gray-300';

const EmergencySafetyGuidePage: React.FC = () => {
  return (
    <PageLayout
      title="Digital Safety Emergency Guide"
      subtitle="If something went wrong online, start here. Hotline numbers and step-by-step actions come first."
      breadcrumbs
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <section>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-800 sm:text-2xl dark:text-red-200">
              <Phone className="h-6 w-6 shrink-0" aria-hidden />
              Emergency contacts
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-red-800 dark:text-red-200">National emergency numbers</h3>
                <ul className="space-y-1 text-sm text-red-900 dark:text-red-100">
                  <li><strong>911</strong> — Emergency services</li>
                  <li><strong>1-800-843-5678</strong> — CyberTipline (NCMEC)</li>
                  <li><strong>1-800-4-A-CHILD</strong> — Childhelp National Child Abuse Hotline</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-red-800 dark:text-red-200">Online safety resources</h3>
                <ul className="space-y-1 text-sm text-red-900 dark:text-red-100">
                  <li><strong>1-800-843-5678</strong> — National Center for Missing &amp; Exploited Children</li>
                  <li><strong>1-800-273-8255</strong> — National Suicide Prevention Lifeline</li>
                  <li><strong>1-800-799-7233</strong> — National Domestic Violence Hotline</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Immediate response steps</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Stay calm and assess the situation',
                items: [
                  'Take a deep breath and remain calm',
                  'Assess the immediate danger level',
                  'If there is immediate physical danger, call 911',
                  'Reassure your child that they are not in trouble',
                ],
              },
              {
                title: 'Document everything',
                items: [
                  'Take screenshots of all relevant content',
                  'Save URLs and timestamps',
                  'Document who was involved',
                  'Keep a detailed record of all communications',
                ],
              },
              {
                title: 'Secure accounts and devices',
                items: [
                  'Change all passwords immediately',
                  'Enable two-factor authentication',
                  'Log out of all devices and sessions',
                  'Check for unauthorized access or changes',
                ],
              },
              {
                title: 'Report to appropriate authorities',
                items: [
                  'Report to the platform where the incident occurred',
                  'Contact local law enforcement if necessary',
                  'Report to the CyberTipline for child exploitation',
                  "Notify your child's school if other students are involved",
                ],
              },
            ].map((step, index) => (
              <div key={step.title} className={cardClass}>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    <span className="font-bold text-red-700 dark:text-red-300">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className={subheadingClass}>{step.title}</h3>
                    <ul className={bodyListClass}>
                      {step.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Specific emergency response plans</h2>
          <div className="space-y-6">
            <div className={cardClass}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Users size={24} className="text-orange-600 dark:text-orange-400" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Cyberbullying</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className={labelClass}>Immediate actions</h4>
                  <ul className={bodyListClass}>
                    <li>Block the bully on all platforms</li>
                    <li>Save evidence (screenshots, messages)</li>
                    <li>Report to the platform</li>
                    <li>Contact school administration if students are involved</li>
                  </ul>
                </div>
                <div>
                  <h4 className={labelClass}>Support your child</h4>
                  <ul className={bodyListClass}>
                    <li>Listen without judgment</li>
                    <li>Reassure them it is not their fault</li>
                    <li>Consider professional counseling if needed</li>
                    <li>Talk together about what happened and what they want next</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                  <Shield size={24} className="text-red-600 dark:text-red-400" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Privacy breach</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className={labelClass}>Immediate actions</h4>
                  <ul className={bodyListClass}>
                    <li>Change all passwords immediately</li>
                    <li>Enable two-factor authentication</li>
                    <li>Check for unauthorized account activity</li>
                    <li>Review privacy settings on all platforms</li>
                  </ul>
                </div>
                <div>
                  <h4 className={labelClass}>Damage control</h4>
                  <ul className={bodyListClass}>
                    <li>Contact platforms to request content removal</li>
                    <li>Monitor for identity theft signs</li>
                    <li>Consider credit monitoring services</li>
                    <li>Document all steps taken</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <AlertTriangle size={24} className="text-purple-600 dark:text-purple-400" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Online exploitation</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className={labelClass}>Immediate actions</h4>
                  <ul className={bodyListClass}>
                    <li>Call 911 if there is immediate danger</li>
                    <li>Contact the CyberTipline: 1-800-843-5678</li>
                    <li>Preserve all evidence (do not delete anything)</li>
                    <li>Contact local law enforcement</li>
                  </ul>
                </div>
                <div>
                  <h4 className={labelClass}>Support your child</h4>
                  <ul className={bodyListClass}>
                    <li>Seek immediate professional counseling</li>
                    <li>Work with law enforcement and child advocacy centers</li>
                    <li>Create a safe, supportive environment</li>
                    <li>Consider family therapy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Legal considerations</h2>
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950/30">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-yellow-900 dark:text-yellow-100">
              <Scale className="h-5 w-5 shrink-0" aria-hidden />
              Important legal notes
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <li>Laws vary by state and country — consult local legal resources</li>
              <li>Document everything for potential legal proceedings</li>
              <li>Consider consulting with an attorney specializing in internet law</li>
              <li>Be aware of statutes of limitations for reporting</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">When to contact law enforcement</h3>
              <ul className={bodyListClass}>
                <li>Threats of violence or harm</li>
                <li>Sexual exploitation or grooming</li>
                <li>Identity theft or financial fraud</li>
                <li>Stalking or harassment</li>
                <li>Distribution of intimate images without consent</li>
              </ul>
            </div>
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Evidence preservation</h3>
              <ul className={bodyListClass}>
                <li>Take screenshots of all relevant content</li>
                <li>Save URLs and timestamps</li>
                <li>Keep original devices if possible</li>
                <li>Document all communications</li>
                <li>Create a detailed timeline of events</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Recovery and prevention</h2>
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Immediate recovery steps</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className={labelClass}>For your child</h4>
                  <ul className={bodyListClass}>
                    <li>Provide emotional support and reassurance</li>
                    <li>Seek professional counseling if needed</li>
                    <li>Gradually reintroduce safe online activities</li>
                    <li>Establish new, stronger privacy boundaries</li>
                  </ul>
                </div>
                <div>
                  <h4 className={labelClass}>For your family</h4>
                  <ul className={bodyListClass}>
                    <li>Review and update family internet rules</li>
                    <li>Talk through device rules together</li>
                    <li>Consider family counseling</li>
                    <li>Create a support network</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Long-term prevention</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className={labelClass}>Technical measures</h4>
                  <ul className={bodyListClass}>
                    <li>Use comprehensive parental controls</li>
                    <li>Enable two-factor authentication everywhere</li>
                    <li>Regularly review privacy settings</li>
                    <li>Use strong, unique passwords</li>
                  </ul>
                </div>
                <div>
                  <h4 className={labelClass}>Educational measures</h4>
                  <ul className={bodyListClass}>
                    <li>Continue privacy education conversations</li>
                    <li>Teach critical thinking about online content</li>
                    <li>Encourage open communication</li>
                    <li>Model good digital citizenship</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className={headingClass}>Additional resources</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Professional help</h3>
              <ul className={bodyListClass}>
                <li>Child psychologists specializing in trauma</li>
                <li>Family therapists</li>
                <li>Internet safety specialists</li>
                <li>Legal professionals</li>
              </ul>
            </div>
            <div className={cardClass}>
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Support organizations</h3>
              <ul className={bodyListClass}>
                <li>National Center for Missing &amp; Exploited Children</li>
                <li>Cyberbullying Research Center</li>
                <li>Family Online Safety Institute</li>
                <li>Local child advocacy centers</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-red-800 bg-red-700 p-6 text-center text-white sm:p-8 dark:border-red-700 dark:bg-red-900">
          <h2 className="mb-3 text-xl font-bold sm:text-2xl">You are not alone</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-red-50">
            If you are dealing with a digital safety emergency, reach out for help immediately.
            There are resources and people who can support you and your family.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:911" className="button inline-flex min-h-[44px] items-center rounded-xl bg-white px-5 py-2.5 font-semibold text-red-700 hover:bg-red-50">
              Call 911 (emergency)
            </a>
            <a
              href="tel:1-800-843-5678"
              className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              CyberTipline
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EmergencySafetyGuidePage;
