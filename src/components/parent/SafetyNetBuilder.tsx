import React, { useState } from 'react';
import { Users, Phone, Mail, AlertTriangle, Shield, CheckCircle, Plus, X, Edit2 } from 'lucide-react';
import { useFamily } from '../../contexts/FamilyContext';

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

const SafetyNetBuilder: React.FC = () => {
  const { familyMembers } = useFamily();
  const [techGuides, setTechGuides] = useState<TechGuide[]>([]);
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>([]);
  const [warningSigns, setWarningSigns] = useState<WarningSign[]>([
    { id: '1', description: 'Unexpected charges on credit cards or bank statements', checked: false },
    { id: '2', description: 'Receiving emails or calls from unknown companies asking for personal information', checked: false },
    { id: '3', description: 'Noticing new accounts or apps you didn\'t create', checked: false },
    { id: '4', description: 'Friends or family receiving strange messages from your accounts', checked: false },
    { id: '5', description: 'Unable to log into your accounts (password changed)', checked: false },
    { id: '6', description: 'Seeing posts or activity on your social media you didn\'t create', checked: false },
    { id: '7', description: 'Receiving notifications about login attempts from unfamiliar locations', checked: false },
    { id: '8', description: 'Noticing your device is slower or behaving strangely', checked: false }
  ]);
  const [showAddTechGuide, setShowAddTechGuide] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  const [newTechGuide, setNewTechGuide] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false,
    isBackup: false
  });

  const [newContact, setNewContact] = useState({
    issueType: '',
    contactName: '',
    contactMethod: 'phone',
    phone: '',
    email: ''
  });

  const addTechGuide = () => {
    if (!newTechGuide.name || (!newTechGuide.phone && !newTechGuide.email)) {return;}

    const guide: TechGuide = {
      id: `guide-${Date.now()}`,
      ...newTechGuide
    };

    setTechGuides([...techGuides, guide]);
    setNewTechGuide({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
      isBackup: false
    });
    setShowAddTechGuide(false);
  };

  const addPointOfContact = () => {
    if (!newContact.issueType || !newContact.contactName) {return;}

    const contact: PointOfContact = {
      id: `contact-${Date.now()}`,
      ...newContact
    };

    setPointsOfContact([...pointsOfContact, contact]);
    setNewContact({
      issueType: '',
      contactName: '',
      contactMethod: 'phone',
      phone: '',
      email: ''
    });
    setShowAddContact(false);
  };

  const toggleWarningSign = (id: string) => {
    setWarningSigns(warningSigns.map(sign =>
      sign.id === id ? { ...sign, checked: !sign.checked } : sign
    ));
  };

  const removeTechGuide = (id: string) => {
    setTechGuides(techGuides.filter(guide => guide.id !== id));
  };

  const removeContact = (id: string) => {
    setPointsOfContact(pointsOfContact.filter(contact => contact.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50', marginBottom: '0.5rem' }}>
          Build Your Digital Safety Net
        </h2>
        <p style={{ color: '#666', fontSize: '1.125rem' }}>
          Set up your family's support network for handling online privacy issues and emergencies
        </p>
      </div>

      {/* Tech Guides Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2C3E50', marginBottom: '0.25rem' }}>
              Designate Tech Guides
            </h3>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Choose trusted family members or friends who can help with technology questions and privacy issues
            </p>
          </div>
          <button
            onClick={() => setShowAddTechGuide(!showAddTechGuide)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            <Plus size={16} />
            Add Tech Guide
          </button>
        </div>

        {showAddTechGuide && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '1rem' }}>
              Add New Tech Guide
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Name"
                value={newTechGuide.name}
                onChange={(e) => setNewTechGuide({ ...newTechGuide, name: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="text"
                placeholder="Relationship (e.g., Uncle, Friend)"
                value={newTechGuide.relationship}
                onChange={(e) => setNewTechGuide({ ...newTechGuide, relationship: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newTechGuide.phone}
                onChange={(e) => setNewTechGuide({ ...newTechGuide, phone: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newTechGuide.email}
                onChange={(e) => setNewTechGuide({ ...newTechGuide, email: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newTechGuide.isPrimary}
                  onChange={(e) => setNewTechGuide({ ...newTechGuide, isPrimary: e.target.checked, isBackup: e.target.checked ? false : newTechGuide.isBackup })}
                />
                <span style={{ fontSize: '0.875rem', color: '#666' }}>Primary Contact</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newTechGuide.isBackup}
                  onChange={(e) => setNewTechGuide({ ...newTechGuide, isBackup: e.target.checked, isPrimary: e.target.checked ? false : newTechGuide.isPrimary })}
                />
                <span style={{ fontSize: '0.875rem', color: '#666' }}>Backup Contact</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={addTechGuide}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Add Guide
              </button>
              <button
                onClick={() => {
                  setShowAddTechGuide(false);
                  setNewTechGuide({
                    name: '',
                    relationship: '',
                    phone: '',
                    email: '',
                    isPrimary: false,
                    isBackup: false
                  });
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {techGuides.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
            No tech guides added yet. Add someone who can help with technology questions.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {techGuides.map(guide => (
              <div
                key={guide.id}
                style={{
                  backgroundColor: guide.isPrimary ? '#f0fdf4' : guide.isBackup ? '#fef3c7' : '#f8f9fa',
                  border: `2px solid ${guide.isPrimary ? '#10b981' : guide.isBackup ? '#f59e0b' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => removeTechGuide(guide.id)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    padding: '0.25rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} style={{ color: '#dc2626' }} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Users size={24} style={{ color: guide.isPrimary ? '#10b981' : guide.isBackup ? '#f59e0b' : '#666' }} />
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50' }}>
                      {guide.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {guide.relationship}
                    </div>
                  </div>
                </div>
                {guide.isPrimary && (
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    Primary Contact
                  </span>
                )}
                {guide.isBackup && (
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    Backup Contact
                  </span>
                )}
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  {guide.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Phone size={14} />
                      {guide.phone}
                    </div>
                  )}
                  {guide.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} />
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
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2C3E50', marginBottom: '0.25rem' }}>
              Points of Contact
            </h3>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Who to contact for different types of privacy issues or emergencies
            </p>
          </div>
          <button
            onClick={() => setShowAddContact(!showAddContact)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            <Plus size={16} />
            Add Contact
          </button>
        </div>

        {showAddContact && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '1rem' }}>
              Add Point of Contact
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Issue Type (e.g., Account Hacked, Scam)"
                value={newContact.issueType}
                onChange={(e) => setNewContact({ ...newContact, issueType: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="text"
                placeholder="Contact Name or Organization"
                value={newContact.contactName}
                onChange={(e) => setNewContact({ ...newContact, contactName: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
              <select
                value={newContact.contactMethod}
                onChange={(e) => setNewContact({ ...newContact, contactMethod: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="both">Both</option>
              </select>
              {newContact.contactMethod !== 'email' && (
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
              )}
              {newContact.contactMethod !== 'phone' && (
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={addPointOfContact}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Add Contact
              </button>
              <button
                onClick={() => {
                  setShowAddContact(false);
                  setNewContact({
                    issueType: '',
                    contactName: '',
                    contactMethod: 'phone',
                    phone: '',
                    email: ''
                  });
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#666',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {pointsOfContact.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
            No points of contact added yet. Add contacts for different types of privacy issues.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pointsOfContact.map(contact => (
              <div
                key={contact.id}
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#2C3E50', marginBottom: '0.25rem' }}>
                    {contact.issueType}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    Contact: {contact.contactName}
                    {contact.phone && ` • ${contact.phone}`}
                    {contact.email && ` • ${contact.email}`}
                  </div>
                </div>
                <button
                  onClick={() => removeContact(contact.id)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} style={{ color: '#dc2626' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warning Signs Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2C3E50', marginBottom: '0.25rem' }}>
            Recognize Warning Signs
          </h3>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Know what to look for - these are red flags that something might be wrong with your online privacy
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {warningSigns.map(sign => (
            <div
              key={sign.id}
              onClick={() => toggleWarningSign(sign.id)}
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: sign.checked ? '#fef2f2' : '#f8f9fa',
                borderRadius: '8px',
                cursor: 'pointer',
                border: sign.checked ? '2px solid #dc2626' : '1px solid #e5e7eb',
                transition: 'all 0.2s'
              }}
            >
              {sign.checked ? (
                <CheckCircle size={24} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertTriangle size={24} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
              )}
              <span style={{
                fontSize: '0.9375rem',
                color: sign.checked ? '#991b1b' : '#2C3E50',
                lineHeight: 1.6
              }}>
                {sign.description}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
            <Shield size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.25rem' }}>
                What to Do If You See Warning Signs
              </strong>
              <p style={{ color: '#92400e', margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
                If you notice any of these warning signs, don't panic. Take screenshots of anything suspicious, 
                contact your tech guide or point of contact, and follow the safety protocols you've established. 
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

