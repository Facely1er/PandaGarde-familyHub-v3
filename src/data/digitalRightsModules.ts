import { Globe, Scale, Shield, AlertTriangle, FileText } from 'lucide-react';
import { estimateReadingMinutes, formatReadingTime } from '../utils/readingTime';

export type LawModuleCategory =
  | 'privacy-laws'
  | 'data-rights'
  | 'consent'
  | 'international'
  | 'enforcement'
  | 'future';

export type LawModuleDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LawModule {
  id: string;
  title: string;
  description: string;
  category: LawModuleCategory;
  difficulty: LawModuleDifficulty;
  duration: string;
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  overview: string[];
  keyPoints: string[];
  realWorldExamples: string[];
  yourRights: string[];
  actionSteps: string[];
}

const rawModules: Omit<LawModule, 'duration' | 'completed'>[] = [
  {
    id: 'gdpr-basics',
    title: 'GDPR: Your Privacy Rights in Europe',
    description:
      'Understand the General Data Protection Regulation and how it protects personal data for people in the European Union and European Economic Area.',
    category: 'privacy-laws',
    difficulty: 'Intermediate',
    icon: Globe,
    overview: [
      'The General Data Protection Regulation (GDPR) is the main privacy law in the EU and EEA. It applies to companies that offer services to people in Europe—even if the company is based in the United States.',
      'GDPR is built around transparency and control: organizations must explain what they collect, why they need it, and how long they keep it. You can ask for a copy of your data, fix mistakes, limit certain uses, and request deletion in many situations.',
      'For teens, GDPR matters when you use global apps, school platforms with EU vendors, or travel and study in Europe. Your age can affect how consent works, but many core rights still apply through parents or guardians where the law requires it.'
    ],
    keyPoints: [
      'GDPR applies to anyone in the EU/EEA, regardless of citizenship',
      'You have the right to access your personal data',
      'You can request deletion of your data (“right to be forgotten”) in many cases',
      'Companies must get clear, lawful consent before collecting data',
      'You can object to certain automated decision-making',
      'Serious data breaches must be reported to authorities within 72 hours'
    ],
    realWorldExamples: [
      'Downloading a copy of your data from a social platform’s privacy settings',
      'Asking a gaming company to delete an account you no longer use',
      'Opting out of personalized ads in an app’s privacy center',
      'Requesting correction of a wrong birth date on a school portal',
      'Questioning an automated rejection from an online application tool'
    ],
    yourRights: [
      'Right to be informed about data collection',
      'Right of access to your personal data',
      'Right to rectification of inaccurate data',
      'Right to erasure (“right to be forgotten”)',
      'Right to restrict processing',
      'Right to data portability',
      'Right to object to processing',
      'Rights related to automated decision-making'
    ],
    actionSteps: [
      'Open the privacy or “download my data” section of an app you use',
      'List what data you expected vs. what the export actually contains',
      'Talk with a parent or guardian before sending formal deletion requests'
    ]
  },
  {
    id: 'ccpa-california',
    title: 'CCPA: California Consumer Privacy Act',
    description:
      'Learn how California’s privacy law gives residents—including teens—rights to know, delete, and opt out of certain data uses.',
    category: 'privacy-laws',
    difficulty: 'Intermediate',
    icon: Scale,
    overview: [
      'The California Consumer Privacy Act (CCPA), together with the CPRA amendments, gives California residents strong rights over personal information held by many businesses.',
      'If you live in California, you can often find a “Do Not Sell or Share My Personal Information” link, request a report of categories of data collected, and ask for deletion—without being charged more or denied service for exercising those rights.',
      'Teens should know that “sale” under California law can include sharing data for cross-context behavioral advertising, not only exchanging data for money.'
    ],
    keyPoints: [
      'CCPA/CPRA applies to California residents of any age',
      'You can know what personal information is collected and why',
      'You can opt out of sale/sharing and limit use of sensitive data',
      'You can request deletion of personal information',
      'Businesses cannot discriminate against you for using your rights',
      'Privacy notices must be clear and accessible'
    ],
    realWorldExamples: [
      'Using a retailer’s “Do Not Sell or Share” control',
      'Requesting a privacy report from a streaming or gaming service',
      'Deleting marketing profiles tied to an old email address',
      'Understanding why similar ads follow you across websites',
      'Checking whether a loyalty program sells contact details'
    ],
    yourRights: [
      'Right to know what personal information is collected',
      'Right to know whether personal information is sold or shared',
      'Right to opt out of sale/sharing and certain uses',
      'Right to access your personal information',
      'Right to correct inaccurate personal information',
      'Right to delete personal information',
      'Right to equal service and price when you exercise rights'
    ],
    actionSteps: [
      'Confirm whether a site’s footer links to California privacy rights',
      'Submit one opt-out or access request and save the confirmation email',
      'Review the response with a trusted adult if the company asks for ID'
    ]
  },
  {
    id: 'modpa-maryland',
    title: 'MODPA: Maryland Online Data Privacy Act',
    description:
      'Learn how Maryland’s privacy law helps residents opt out, access, correct, delete, and port personal data.',
    category: 'privacy-laws',
    difficulty: 'Beginner',
    icon: Scale,
    overview: [
      'The Maryland Online Data Privacy Act (MODPA) gives Maryland residents practical tools to control personal data held by many businesses and some school-related vendors.',
      'You can request access, correction, deletion, and portability, and you can opt out of the sale of personal data and targeted advertising. Companies generally must respond within set timeframes (often 15–30 days depending on the request type).',
      'If your school or district uses the EduSoluce Privacy Portal, that portal is one way families submit MODPA-style requests for connected EdTech services—always follow your school’s instructions.'
    ],
    keyPoints: [
      'MODPA applies to Maryland residents and covered controllers',
      'You can opt out of sale of personal data and targeted advertising',
      'You can request access, correction, deletion, and portability',
      'Opt-out and consent revocation must be honored within defined deadlines',
      'Schools and EdTech may route requests through an approved privacy portal'
    ],
    realWorldExamples: [
      'Submitting an opt-out through your school’s privacy portal',
      'Requesting a copy of data from a learning app tied to your classes',
      'Asking to delete a younger sibling’s profile from an educational game',
      'Revoking consent for targeted ads on a family shopping account'
    ],
    yourRights: [
      'Right to know what personal data is collected',
      'Right to access your personal data',
      'Right to correct inaccurate data',
      'Right to delete your data',
      'Right to data portability',
      'Right to opt out of sale and targeted advertising',
      'Right to revoke consent within required timeframes'
    ],
    actionSteps: [
      'Use your school’s privacy portal links if your district provides them',
      'Keep a simple log: date, company, request type, and confirmation number',
      'Follow up politely if you do not receive a response within the posted window'
    ]
  },
  {
    id: 'coppa-under-13',
    title: 'COPPA: Protection for Kids Under 13',
    description:
      'Understand how the Children’s Online Privacy Protection Act limits data collection from children under 13 in the United States.',
    category: 'consent',
    difficulty: 'Beginner',
    icon: Shield,
    overview: [
      'COPPA is a U.S. federal law that protects children under 13 online. It requires verifiable parental consent before most websites and apps collect, use, or disclose personal information from young children.',
      'Services directed to kids—or that know they have under-13 users—must post clear privacy policies, collect only what they reasonably need, and avoid many forms of behavioral advertising to children.',
      'If you are 13 or older, COPPA’s child-specific rules usually do not apply to you—but you may still benefit from similar protections in app store policies, school contracts, and state laws.'
    ],
    keyPoints: [
      'COPPA protects children under 13 in the United States',
      'Verifiable parental consent is required before most data collection',
      'Operators must limit collection to what is reasonably necessary',
      'Parents can review and delete a child’s personal information',
      'Behavioral advertising to children under 13 is heavily restricted',
      'Operators must maintain and honor a clear children’s privacy policy'
    ],
    realWorldExamples: [
      'An app asking a parent to confirm an account for a younger sibling',
      'A website blocking sign-ups under 13 instead of collecting data illegally',
      'School software sending COPPA notices home before student accounts activate',
      'Parental controls limiting purchases or chat on a child’s tablet',
      'A family requesting deletion of a child’s profile from an educational game'
    ],
    yourRights: [
      'Right to have parental consent before most data collection (under 13)',
      'Right to have parents review and delete collected data',
      'Right to age-appropriate privacy protections on child-directed services',
      'Right to limits on unnecessary data collection',
      'Right to protection from many forms of targeted ads aimed at young kids'
    ],
    actionSteps: [
      'If you are under 13, involve a parent before creating accounts that ask for personal details',
      'Read the children’s privacy section of apps your family installs',
      'Ask a parent to use the service’s parent portal to review or delete child data'
    ]
  },
  {
    id: 'ferpa-school-records',
    title: 'FERPA: School Records & Student Privacy',
    description:
      'Learn how the Family Educational Rights and Privacy Act protects education records and what schools can share.',
    category: 'data-rights',
    difficulty: 'Intermediate',
    icon: FileText,
    overview: [
      'FERPA is a U.S. federal law that protects the privacy of student education records. It gives parents (and eligible students, usually 18+) the right to inspect records, request corrections, and control many disclosures.',
      'Schools may share directory information (like name in a yearbook) only with notice and opt-out opportunities. Most other sharing—to vendors, researchers, or other agencies—requires consent or a specific legal exception.',
      'When your school uses learning apps, FERPA works alongside vendor contracts and state laws. You are not “monitored” at home by FERPA; it governs official records held by the school.'
    ],
    keyPoints: [
      'Education records include grades, schedules, discipline, and related files',
      'Parents generally control access until a student becomes an eligible student (often 18)',
      'Schools must provide notice before sharing directory information',
      'Third-party EdTech needs a lawful basis—often a school contract, not your click-through alone',
      'You can challenge inaccurate records through official school processes'
    ],
    realWorldExamples: [
      'Requesting a copy of your transcript or discipline file',
      'Opting out of having your photo published in a school directory',
      'Asking what apps receive roster data from your district',
      'Correcting a wrong address or legal name on official records',
      'Understanding why a college application needs a school official transcript'
    ],
    yourRights: [
      'Right to inspect and review education records (through parents if under 18)',
      'Right to seek amendment of inaccurate or misleading records',
      'Right to consent to many disclosures of personally identifiable information',
      'Right to file a complaint with the U.S. Department of Education',
      'Right to know who has accessed records when required by policy'
    ],
    actionSteps: [
      'Find your district’s directory-information opt-out form each school year',
      'Ask your school counselor which learning tools receive roster or grade data',
      'Keep a list of questions before a parent meeting about data sharing'
    ]
  },
  {
    id: 'international-laws',
    title: 'International Privacy Laws',
    description:
      'Compare how different countries approach privacy and what that means when you use global apps and platforms.',
    category: 'international',
    difficulty: 'Advanced',
    icon: Globe,
    overview: [
      'There is no single global privacy law. Countries and regions set their own rules—from comprehensive laws like GDPR to sector-specific rules for health, finance, or children.',
      'Companies operating internationally often maintain different privacy notices, data centers, and feature sets by region. That is why an app may offer stronger controls in Europe than elsewhere.',
      'Understanding the basics helps you ask better questions: Which country’s law applies? Where is data stored? Can I move my data or delete it across borders?'
    ],
    keyPoints: [
      'Privacy protections vary widely by country and region',
      'Some laws require data to stay within national borders (data localization)',
      'Cross-border transfers may need contracts or adequacy decisions',
      'Global companies must map which law applies to each user',
      'New laws and enforcement actions appear every year'
    ],
    realWorldExamples: [
      'Different default privacy settings in the EU vs. the U.S. for the same app',
      'An app unavailable in a country because of local law conflicts',
      'News about regulators fining companies for cross-border data misuse',
      'School contracts choosing EU-hosted tools for stricter transfer rules',
      'Biometric or AI laws adding new categories of sensitive data'
    ],
    yourRights: [
      'Right to know which legal framework likely applies to you',
      'Right to seek protections available in your country of residence',
      'Right to understand when data leaves your region',
      'Right to complain to supervisory authorities where laws provide them',
      'Right to benefit as laws strengthen over time'
    ],
    actionSteps: [
      'Check the app’s region or country selector in account settings',
      'Read the “international transfers” section of a privacy policy once',
      'Discuss with a teacher how your school chooses vendors with global users'
    ]
  },
  {
    id: 'enforcement-complaints',
    title: 'How to Enforce Your Rights',
    description:
      'Learn practical steps to document problems, contact companies, and escalate to regulators when privacy rights are ignored.',
    category: 'enforcement',
    difficulty: 'Intermediate',
    icon: AlertTriangle,
    overview: [
      'Privacy rights only help if you can use them. Start with the service itself: most companies provide web forms or email addresses for access, deletion, and opt-out requests.',
      'Keep evidence—screenshots, dates, ticket numbers, and copies of your requests. If the company misses legal deadlines or refuses without a valid reason, you may file a complaint with a data protection authority or state attorney general, depending on where you live.',
      'Serious harm (identity theft, stalking, illegal sharing of intimate images) may need law enforcement or civil legal advice in addition to privacy regulators.'
    ],
    keyPoints: [
      'Document requests and responses with dates and reference numbers',
      'Many issues resolve when you escalate to a privacy or legal team',
      'Regulators can investigate patterns of violations and impose fines',
      'Some laws allow private lawsuits or damages for certain breaches',
      'School-related issues may involve district privacy officers as well as regulators'
    ],
    realWorldExamples: [
      'Filing a complaint with a state or national data protection authority',
      'Using a company’s appeal process after a denied deletion request',
      'Reporting a data breach notice that seems fraudulent',
      'Working with a school IT department when an EdTech vendor will not respond',
      'Contacting a consumer protection office about deceptive privacy practices'
    ],
    yourRights: [
      'Right to file complaints with supervisory authorities',
      'Right to seek remedies available under applicable law',
      'Right to compensation in some jurisdictions for certain harms',
      'Right to have credible complaints investigated',
      'Right to be informed of outcomes when regulators require disclosure'
    ],
    actionSteps: [
      'Save a template email for access/deletion/opt-out with your jurisdiction noted',
      'Set a calendar reminder for the legal response deadline (often 30–45 days)',
      'Involve a trusted adult before submitting regulator complaints with personal details'
    ]
  },
  {
    id: 'future-privacy-laws',
    title: 'The Future of Privacy Law',
    description:
      'Explore trends—AI, biometrics, and state/federal proposals—that will shape the digital rights landscape over the next few years.',
    category: 'future',
    difficulty: 'Advanced',
    icon: FileText,
    overview: [
      'Privacy law is changing quickly. Legislators in the U.S. and abroad are debating comprehensive privacy bills, AI transparency rules, and stricter limits on sensitive data like biometrics and precise location.',
      '“Privacy by design” is shifting from best practice to legal expectation: products should minimize data collection by default and give users meaningful controls up front.',
      'Teens can participate by commenting on proposed rules, joining student digital-citizenship groups, and choosing tools that publish clear, honest privacy practices.'
    ],
    keyPoints: [
      'U.S. states continue passing new consumer privacy laws',
      'AI training and inference raise new questions about consent and deletion',
      'Biometric and neuro-data categories are gaining special protections',
      'Cross-border agreements are being renegotiated as enforcement grows',
      'Youth voices increasingly influence school and platform policies'
    ],
    realWorldExamples: [
      'State laws copying opt-out and access rights from California or Maryland',
      'Platforms labeling AI-generated content and limiting training on user posts',
      'Schools banning certain apps until vendor contracts meet new standards',
      'Public comment periods on federal or state privacy rulemaking',
      'Open-source and privacy-preserving technologies gaining adoption'
    ],
    yourRights: [
      'Right to stay informed about laws that affect you',
      'Right to advocate for stronger protections in school and community settings',
      'Right to choose services that respect privacy by default',
      'Right to expect clearer notices as legal standards rise',
      'Right to participate in democratic processes that shape technology policy'
    ],
    actionSteps: [
      'Follow one trusted source for privacy news (e.g., your school’s digital citizenship curriculum)',
      'Compare two apps’ privacy labels before adopting a new platform',
      'Ask your student council whether the school has a digital-rights statement'
    ]
  }
];

function withDuration(
  module: Omit<LawModule, 'duration' | 'completed'>
): LawModule {
  const minutes = estimateReadingMinutes(
    module.description,
    ...module.overview,
    ...module.keyPoints,
    ...module.realWorldExamples,
    ...module.yourRights,
    ...module.actionSteps
  );
  return {
    ...module,
    duration: formatReadingTime(minutes),
    completed: false
  };
}

export const digitalRightsModules: LawModule[] = rawModules.map(withDuration);
