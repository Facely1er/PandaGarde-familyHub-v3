import React, { useState } from 'react';
import { Users, Phone, Mail, AlertTriangle, Shield, CheckCircle, Plus, X } from 'lucide-react';

interface TechGuide {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  isBackup: boolean;
}

interface PointOfContact {
  id: string;
  issueType: string;
  contactName: string;
  contactMethod: string;
  phone?: string;
  email?: string;
}

interface WarningSign {
  id: string;
  description: string;
  checked: boolean;
}

const fieldClass =
  'w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-200 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500';

const sectionCardClass =
  'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-200 p-6 mb-8';

const btnPrimaryClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 rounded-md transition-colors';

const btnSecondaryClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors';

const btnBlueClass =
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md transition-colors';

function guideCardClass(guide: TechGuide): string {
  if (guide.isPrimary) {
    return 'relative rounded-lg p-4 border-2 bg-green-50 dark:bg-green-950/40 border-green-500';
  }
  if (guide.isBackup) {
    return 'relative rounded-lg p-4 border-2 bg-amber-50 dark:bg-amber-950/40 border-amber-500';
  }
  return 'relative rounded-lg p-4 border-2 bg-gray-50 dark:bg-gray-200 border-gray-200 dark:border-gray-700';
}

function guideIconClass(guide: TechGuide): string {
  if (guide.isPrimary) {return 'text-green-600 dark:text-green-400';}
  if (guide.isBackup) {return 'text-amber-600 dark:text-amber-400';}
  return 'text-gray-500 dark:text-gray-400';
}

const SafetyNetBuilder: React.FC = () => {
  const [techGuides, setTechGuides] = useState<TechGuide[]>([]);
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>([]);
  const [warningSigns, setWarningSigns] = useState<WarningSign[]>([
    { id: '1', description: 'Unexpected charges on credit cards or bank statements', checked: false },
    { id: '2', description: 'Receiving emails or calls from unknown companies asking for personal information', checked: false },
    { id: '3', description: "Noticing new accounts or apps you didn't create", checked: false },
    { id: '4', description: 'Friends or family receiving strange messages from your accounts', checked: false },
    { id: '5', description: 'Unable to log into your accounts (password changed)', checked: false },
    { id: '6', description: "Seeing posts or activity on your social media you didn't create", checked: false },
    { id: '7', description: 'Receiving notifications about login attempts from unfamiliar locations', checked: false },
    { id: '8', description: 'Noticing your device is slower or behaving strangely', checked: false },
  ]);
  const [showAddTechGuide, setShowAddTechGuide] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  const [newTechGuide, setNewTechGuide] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false,
    isBackup: false,
  });

  const [newContact, setNewContact] = useState({
    issueType: '',
    contactName: '',
    contactMethod: 'phone',
    phone: '',
    email: '',
  });

  const addTechGuide = () => {
    if (!newTechGuide.name || (!newTechGuide.phone && !newTechGuide.email)) {return;}

    const guide: TechGuide = {
      id: `guide-${Date.now()}`,
      ...newTechGuide,
    };

    setTechGuides([...techGuides, guide]);
    setNewTechGuide({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
      isBackup: false,
    });
    setShowAddTechGuide(false);
  };

  const addPointOfContact = () => {
    if (!newContact.issueType || !newContact.contactName) {return;}

    const contact: PointOfContact = {
      id: `contact-${Date.now()}`,
      ...newContact,
    };

    setPointsOfContact([...pointsOfContact, contact]);
    setNewContact({
      issueType: '',
      contactName: '',
      contactMethod: 'phone',
      phone: '',
      email: '',
    });
    setShowAddContact(false);
  };

  const toggleWarningSign = (id: string) => {
    setWarningSigns(
      warningSigns.map((sign) => (sign.id === id ? { ...sign, checked: !sign.checked } : sign))
    );
  };

  const removeTechGuide = (id: string) => {
    setTechGuides(techGuides.filter((guide) => guide.id !== id));
  };

  const removeContact = (id: string) => {
    setPointsOfContact(pointsOfContact.filter((contact) => contact.id !== id));
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Build Your Digital Safety Net
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Set up your family&apos;s support network for handling online privacy issues and emergencies
        </p>
      </div>

      {/* Tech Guides Section */}
      <div className={sectionCardClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
              Designate Tech Guides
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Choose trusted family members or friends who can help with technology questions and privacy issues
            </p>
          </div>
          <button type="button" onClick={() => setShowAddTechGuide(!showAddTechGuide)} className={btnPrimaryClass}>
            <Plus size={16} aria-hidden />
            Add Tech Guide
          </button>
        </div>

        {showAddTechGuide && (
          <div className="bg-gray-50 dark:bg-gray-100/50 rounded-lg p-4 sm:p-6 mb-4">
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Add New Tech Guide</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="tech-guide-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="tech-guide-name"
                  type="text"
                  placeholder="Name"
                  value={newTechGuide.name}
                  onChange={(e) => setNewTechGuide({ ...newTechGuide, name: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="tech-guide-relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <input
                  id="tech-guide-relationship"
                  type="text"
                  placeholder="e.g., Uncle, Friend"
                  value={newTechGuide.relationship}
                  onChange={(e) => setNewTechGuide({ ...newTechGuide, relationship: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="tech-guide-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  id="tech-guide-phone"
                  type="tel"
                  placeholder="Phone number"
                  value={newTechGuide.phone}
                  onChange={(e) => setNewTechGuide({ ...newTechGuide, phone: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="tech-guide-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="tech-guide-email"
                  type="email"
                  placeholder="Email"
                  value={newTechGuide.email}
                  onChange={(e) => setNewTechGuide({ ...newTechGuide, email: e.target.value })}
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={newTechGuide.isPrimary}
                  onChange={(e) =>
                    setNewTechGuide({
                      ...newTechGuide,
                      isPrimary: e.target.checked,
                      isBackup: e.target.checked ? false : newTechGuide.isBackup,
                    })
                  }
                />
                Primary Contact
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={newTechGuide.isBackup}
                  onChange={(e) =>
                    setNewTechGuide({
                      ...newTechGuide,
                      isBackup: e.target.checked,
                      isPrimary: e.target.checked ? false : newTechGuide.isPrimary,
                    })
                  }
                />
                Backup Contact
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={addTechGuide} className={btnPrimaryClass}>
                Add Guide
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTechGuide(false);
                  setNewTechGuide({
                    name: '',
                    relationship: '',
                    phone: '',
                    email: '',
                    isPrimary: false,
                    isBackup: false,
                  });
                }}
                className={btnSecondaryClass}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {techGuides.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
            No tech guides added yet. Add someone who can help with technology questions.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techGuides.map((guide) => (
              <div key={guide.id} className={guideCardClass(guide)}>
                <button
                  type="button"
                  onClick={() => removeTechGuide(guide.id)}
                  className="absolute top-2 right-2 p-1 text-red-600 dark:text-red-400 hover:opacity-80"
                  aria-label={`Remove ${guide.name}`}
                >
                  <X size={16} aria-hidden />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <Users size={24} className={guideIconClass(guide)} aria-hidden />
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{guide.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{guide.relationship}</div>
                  </div>
                </div>
                {guide.isPrimary && (
                  <span className="inline-block px-3 py-0.5 mb-2 text-xs font-semibold text-white bg-green-600 rounded-full">
                    Primary Contact
                  </span>
                )}
                {guide.isBackup && (
                  <span className="inline-block px-3 py-0.5 mb-2 text-xs font-semibold text-white bg-amber-500 rounded-full">
                    Backup Contact
                  </span>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {guide.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} aria-hidden />
                      {guide.phone}
                    </div>
                  )}
                  {guide.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} aria-hidden />
                      {guide.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Points of Contact Section */}
      <div className={sectionCardClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">Points of Contact</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Who to contact for different types of privacy issues or emergencies
            </p>
          </div>
          <button type="button" onClick={() => setShowAddContact(!showAddContact)} className={btnBlueClass}>
            <Plus size={16} aria-hidden />
            Add Contact
          </button>
        </div>

        {showAddContact && (
          <div className="bg-gray-50 dark:bg-gray-100/50 rounded-lg p-4 sm:p-6 mb-4">
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Add Point of Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="contact-issue-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue type
                </label>
                <input
                  id="contact-issue-type"
                  type="text"
                  placeholder="e.g., Account Hacked, Scam"
                  value={newContact.issueType}
                  onChange={(e) => setNewContact({ ...newContact, issueType: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact name or organization
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Contact name"
                  value={newContact.contactName}
                  onChange={(e) => setNewContact({ ...newContact, contactName: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="contact-method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact method
                </label>
                <select
                  id="contact-method"
                  value={newContact.contactMethod}
                  onChange={(e) => setNewContact({ ...newContact, contactMethod: e.target.value })}
                  className={fieldClass}
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {newContact.contactMethod !== 'email' && (
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="Phone number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className={fieldClass}
                  />
                </div>
              )}
              {newContact.contactMethod !== 'phone' && (
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    className={fieldClass}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={addPointOfContact} className={btnBlueClass}>
                Add Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddContact(false);
                  setNewContact({
                    issueType: '',
                    contactName: '',
                    contactMethod: 'phone',
                    phone: '',
                    email: '',
                  });
                }}
                className={btnSecondaryClass}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {pointsOfContact.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
            No points of contact added yet. Add contacts for different types of privacy issues.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pointsOfContact.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-gray-50 dark:bg-gray-100/50 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{contact.issueType}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Contact: {contact.contactName}
                    {contact.phone && ` • ${contact.phone}`}
                    {contact.email && ` • ${contact.email}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  className="self-end sm:self-center p-2 text-red-600 dark:text-red-400 hover:opacity-80"
                  aria-label={`Remove contact for ${contact.issueType}`}
                >
                  <X size={16} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warning Signs Section */}
      <div className={`${sectionCardClass} mb-0`}>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">Recognize Warning Signs</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Know what to look for — red flags that something might be wrong with your online privacy
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {warningSigns.map((sign) => (
            <button
              key={sign.id}
              type="button"
              onClick={() => toggleWarningSign(sign.id)}
              className={`flex items-start gap-4 p-4 rounded-lg text-left transition-all ${
                sign.checked
                  ? 'bg-red-50 dark:bg-red-950/30 border-2 border-red-600 dark:border-red-500'
                  : 'bg-gray-50 dark:bg-gray-100/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {sign.checked ? (
                <CheckCircle size={24} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden />
              ) : (
                <AlertTriangle size={24} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden />
              )}
              <span
                className={`text-[0.9375rem] leading-relaxed ${
                  sign.checked ? 'text-red-900 dark:text-red-200' : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {sign.description}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-400 dark:border-amber-600">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden />
            <div>
              <strong className="block text-amber-900 dark:text-amber-200 mb-1">
                What to Do If You See Warning Signs
              </strong>
              <p className="text-amber-900 dark:text-amber-200/90 text-sm leading-relaxed m-0">
                If you notice any of these warning signs, don&apos;t panic. Take screenshots of anything suspicious,
                contact your tech guide or point of contact, and follow the safety protocols you&apos;ve established.
                Most issues can be resolved quickly if caught early.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyNetBuilder;
