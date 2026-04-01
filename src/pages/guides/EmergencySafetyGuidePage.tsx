import React from 'react';
import { AlertTriangle, Phone, Users, FileText, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';

const EmergencySafetyGuidePage: React.FC = () => {
  return (
    <PageLayout
      title="Digital Safety Emergency Guide"
      subtitle="Step-by-step instructions for handling privacy breaches, cyberbullying, and other digital safety emergencies. Includes legal considerations and recovery strategies."
      icon={AlertTriangle}
      badge="EMERGENCY GUIDE"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          
        {/* Emergency Contacts */}
        <section style={{ marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
              fontWeight: 700, 
              marginBottom: '1rem',
              color: '#991b1b'
            }}>
              🚨 Emergency Contacts
            </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">National Emergency Numbers</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>911</strong> - Emergency Services</li>
                    <li><strong>1-800-843-5678</strong> - CyberTipline (NCMEC)</li>
                    <li><strong>1-800-4-A-CHILD</strong> - Childhelp National Child Abuse Hotline</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">Online Safety Resources</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>1-800-843-5678</strong> - National Center for Missing & Exploited Children</li>
                    <li><strong>1-800-273-8255</strong> - National Suicide Prevention Lifeline</li>
                    <li><strong>1-800-799-7233</strong> - National Domestic Violence Hotline</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Immediate Response Steps */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Immediate Response Steps
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>Stay Calm and Assess the Situation</h3>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Take a deep breath and remain calm</li>
                      <li>• Assess the immediate danger level</li>
                      <li>• If there's immediate physical danger, call 911</li>
                      <li>• Reassure your child that they're not in trouble</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>Document Everything</h3>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Take screenshots of all relevant content</li>
                      <li>• Save URLs and timestamps</li>
                      <li>• Document who was involved</li>
                      <li>• Keep a detailed record of all communications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>Secure Accounts and Devices</h3>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Change all passwords immediately</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Log out of all devices and sessions</li>
                      <li>• Check for unauthorized access or changes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--primary)' }}>Report to Appropriate Authorities</h3>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Report to the platform where the incident occurred</li>
                      <li>• Contact local law enforcement if necessary</li>
                      <li>• Report to the CyberTipline for child exploitation</li>
                      <li>• Notify your child's school if other students are involved</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Specific Emergency Types */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Specific Emergency Response Plans
            </h2>
            
            <div className="space-y-8">
              {/* Cyberbullying */}
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Cyberbullying</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Immediate Actions:</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Block the bully on all platforms</li>
                      <li>• Save evidence (screenshots, messages)</li>
                      <li>• Report to the platform</li>
                      <li>• Contact school administration if students are involved</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Support Your Child:</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Listen without judgment</li>
                      <li>• Reassure them it's not their fault</li>
                      <li>• Consider professional counseling if needed</li>
                      <li>• Monitor their online activity more closely</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Privacy Breach */}
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Privacy Breach</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Immediate Actions:</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Change all passwords immediately</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Check for unauthorized account activity</li>
                      <li>• Review privacy settings on all platforms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Damage Control:</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Contact platforms to request content removal</li>
                      <li>• Monitor for identity theft signs</li>
                      <li>• Consider credit monitoring services</li>
                      <li>• Document all steps taken</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Online Exploitation */}
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Online Exploitation</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Immediate Actions:</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Call 911 if there's immediate danger</li>
                      <li>• Contact the CyberTipline: 1-800-843-5678</li>
                      <li>• Preserve all evidence (DO NOT delete anything)</li>
                      <li>• Contact local law enforcement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Support Your Child:</h4>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Seek immediate professional counseling</li>
                      <li>• Work with law enforcement and child advocacy centers</li>
                      <li>• Create a safe, supportive environment</li>
                      <li>• Consider family therapy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Considerations */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Legal Considerations
            </h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
              <h3 className="text-xl font-semibold mb-4 text-yellow-800">
                ⚖️ Important Legal Notes
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• Laws vary by state and country - consult local legal resources</li>
                <li>• Document everything for potential legal proceedings</li>
                <li>• Consider consulting with an attorney specializing in internet law</li>
                <li>• Be aware of statutes of limitations for reporting</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>When to Contact Law Enforcement</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                  <li>• Threats of violence or harm</li>
                  <li>• Sexual exploitation or grooming</li>
                  <li>• Identity theft or financial fraud</li>
                  <li>• Stalking or harassment</li>
                  <li>• Distribution of intimate images without consent</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Evidence Preservation</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                  <li>• Take screenshots of all relevant content</li>
                  <li>• Save URLs and timestamps</li>
                  <li>• Keep original devices if possible</li>
                  <li>• Document all communications</li>
                  <li>• Create a detailed timeline of events</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Recovery and Prevention */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Recovery and Prevention
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Immediate Recovery Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>For Your Child:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Provide emotional support and reassurance</li>
                      <li>• Seek professional counseling if needed</li>
                      <li>• Gradually reintroduce safe online activities</li>
                      <li>• Establish new, stronger privacy boundaries</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>For Your Family:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Review and update family internet rules</li>
                      <li>• Implement stronger monitoring systems</li>
                      <li>• Consider family counseling</li>
                      <li>• Create a support network</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Long-term Prevention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>Technical Measures:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Use comprehensive parental controls</li>
                      <li>• Enable two-factor authentication everywhere</li>
                      <li>• Regularly review privacy settings</li>
                      <li>• Use strong, unique passwords</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>Educational Measures:</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                      <li>• Continue privacy education conversations</li>
                      <li>• Teach critical thinking about online content</li>
                      <li>• Encourage open communication</li>
                      <li>• Model good digital citizenship</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
              Additional Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Professional Help</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                  <li>• Child psychologists specializing in trauma</li>
                  <li>• Family therapists</li>
                  <li>• Internet safety specialists</li>
                  <li>• Legal professionals</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md" style={{ backgroundColor: 'var(--card-color)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>Support Organizations</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--gray-600)' }}>
                  <li>• National Center for Missing & Exploited Children</li>
                  <li>• Cyberbullying Research Center</li>
                  <li>• Family Online Safety Institute</li>
                  <li>• Local child advocacy centers</li>
                </ul>
              </div>
            </div>
          </section>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: 'white',
          textAlign: 'center',
          marginTop: 'clamp(2rem, 4vw, 3rem)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', 
            fontWeight: 700, 
            marginBottom: '1rem'
          }}>
            Remember: You're Not Alone
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            marginBottom: '1.5rem', 
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            If you're dealing with a digital safety emergency, reach out for help immediately. 
            There are resources and people who can support you and your family.
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            justifyContent: 'center' 
          }}>
            <a
              href="tel:911"
              style={{
                background: 'white',
                color: '#dc2626',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Call 911 (Emergency)
            </a>
            <a
              href="tel:1-800-843-5678"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '2px solid white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
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