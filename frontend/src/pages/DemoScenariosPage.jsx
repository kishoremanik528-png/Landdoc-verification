import React, { useEffect, useState } from 'react';
import { PlayCircle, ShieldCheck, AlertTriangle, Layers, FileWarning, ArrowRight } from 'lucide-react';
import { getDemoScenarios, runDemoScenario } from '../services/api';

const DemoScenariosPage = ({ onScenarioExecuted }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loadingKey, setLoadingKey] = useState(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const res = await getDemoScenarios();
        if (res.success) setScenarios(res.scenarios);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScenarios();
  }, []);

  const handleRunScenario = async (sKey) => {
    setLoadingKey(sKey);
    try {
      const res = await runDemoScenario(sKey);
      if (res.success && res.application_id) {
        if (onScenarioExecuted) {
          onScenarioExecuted(res.application_id);
        }
      }
    } catch (err) {
      alert("Failed to execute demo scenario.");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <PlayCircle size={14} /> 24-HOUR HACKATHON DEMO SUITE
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>Pre-Configured Demo Scenarios</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          Instantly execute and demonstrate end-to-end AI cross-verification, risk scoring, duplicate detection, tampering checks, and human officer review panels with 1 click!
        </p>
      </div>

      <div className="grid-2">
        {scenarios.map((s) => {
          const isHigh = s.expected_risk === 'HIGH';
          const isMed = s.expected_risk === 'MEDIUM';

          return (
            <div 
              key={s.scenario_key}
              className="gov-card"
              style={{
                borderLeft: `5px solid ${isHigh ? '#DC2626' : isMed ? '#D97706' : '#16A34A'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className={`badge ${isHigh ? 'badge-high' : isMed ? 'badge-medium' : 'badge-low'}`}>
                    EXPECTED RISK: {s.expected_risk}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{s.document_count} Documents</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {s.description}
                </p>

                <div style={{ fontSize: '0.82rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                  Applicant Name: <strong style={{ color: '#0F172A' }}>{s.applicant}</strong>
                </div>
              </div>

              <button
                className="btn btn-gov"
                style={{ width: '100%', padding: '0.75rem' }}
                disabled={loadingKey === s.scenario_key}
                onClick={() => handleRunScenario(s.scenario_key)}
              >
                {loadingKey === s.scenario_key ? (
                  'Running AI Verification Pipeline...'
                ) : (
                  <>
                    <PlayCircle size={16} /> Execute {s.title.split(':')[0]} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DemoScenariosPage;
