import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import DeviceCard from '../components/DeviceCard';
import PowerGauge from '../components/PowerGauge';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock hourly data for the report
  const hourlyReport = Array.from({ length: 12 }, (_, i) => {
    const hour = (23 - i) % 12 || 12;
    const ampm = (23 - i) >= 12 ? 'PM' : 'AM';
    return {
      time: `${hour}:00 ${ampm}`,
      avgPower: 120 + Math.floor(Math.random() * 80),
      peakPower: 200 + Math.floor(Math.random() * 50),
      status: Math.random() > 0.8 ? 'High Usage' : 'Normal',
      efficiency: (85 + Math.random() * 10).toFixed(1) + '%'
    };
  });

  const fetchDevices = useCallback(async () => {
    try {
      const { data } = await API.get('/api/devices');
      setDevices(data.devices);
      setLastUpdated(new Date(data.timestamp));
      setError('');
    } catch (err) {
      setError('Failed to fetch devices. Check connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 3000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const handleToggle = async (deviceId) => {
    const device = devices.find(d => d._id === deviceId);
    if (!device) return;

    try {
      const { data } = await API.post(`/api/devices/${deviceId}/update`, { isOn: !device.isOn });
      setDevices((prev) => prev.map((d) => (d._id === deviceId ? data : d)));
    } catch (err) {
      setError('Failed to update device.');
    }
  };

  const handleBulkToggle = async (turnOn) => {
    try {
      const { data } = await API.post('/api/devices/bulk-update', { isOn: turnOn });
      setDevices(data.devices);
      setLastUpdated(new Date(data.timestamp));
      setError('');
    } catch (err) {
      setError('Failed to toggle all devices.');
    }
  };

  const totalPower = devices.filter((d) => d.isOn).reduce((sum, d) => sum + d.powerConsumption, 0);
  const onCount = devices.filter((d) => d.isOn).length;

  return (
    <div className="dashboard">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-wrap">🏫</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">SmartClass</div>
            <div className="sidebar-brand-sub">Automation System</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Items</div>
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">⚡</span> Dashboard
          </div>

          <div 
            className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <span className="nav-icon">📊</span> Power Report
          </div>
        </nav>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="dash-main">
        {/* Top Bar */}
        <div className="dash-topbar">
          <div className="topbar-title">
            <h1 className="topbar-heading">
              {activeTab === 'dashboard' ? 'Classroom Overview' : 'Hourly Power Report'}
            </h1>
            <p className="topbar-sub">
              {activeTab === 'dashboard' ? 'Real-time device management & monitoring' : 'Historical energy consumption metrics'}
            </p>
          </div>
          <div className="topbar-right">
            {lastUpdated && (
              <div className="topbar-badge">
                <div className="live-dot" /> Live · {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {error && <div className="alert-error dash-error">{error}</div>}

        {activeTab === 'dashboard' ? (
          <>
            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-card total">
                <div className="stat-card-header">
                  <span className="stat-label">Total Devices</span>
                  <span className="stat-icon">🔌</span>
                </div>
                <div className="stat-num">{devices.length}</div>
                <div className="stat-trend">Lights & Fans monitored</div>
              </div>

              <div className="stat-card active">
                <div className="stat-card-header">
                  <span className="stat-label">Active Now</span>
                  <span className="stat-icon">✅</span>
                </div>
                <div className="stat-num">{onCount}</div>
                <div className="stat-trend">{devices.length - onCount} devices off</div>
              </div>

              <div className="stat-card power">
                <div className="stat-card-header">
                  <span className="stat-label">Power Usage</span>
                  <span className="stat-icon">⚡</span>
                </div>
                <div className="stat-num">{totalPower}<span style={{ fontSize: '18px' }}>W</span></div>
                <div className="stat-trend">of 300W capacity</div>
              </div>

              <div className="stat-card update">
                <div className="stat-card-header">
                  <span className="stat-label">Last Updated</span>
                  <span className="stat-icon">🔄</span>
                </div>
                <div className="stat-num">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
                </div>
                <div className="stat-trend">Polls every 3 seconds</div>
              </div>
            </div>

            {loading ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <p>Loading devices...</p>
              </div>
            ) : (
              <div className="dash-body">
                <section className="devices-section">
                  <div className="section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h2 className="section-title">📱 Devices</h2>
                      <span className="section-count">
                        {devices.filter(d => d.type === 'light').length} Lights / {devices.filter(d => d.type === 'fan').length} Fans
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleBulkToggle(true)} className="btn-primary">All ON</button>
                      <button 
                        onClick={() => handleBulkToggle(false)} 
                        className="btn-primary btn-bulk-off"
                      >
                        All OFF
                      </button>
                    </div>
                  </div>
                  <div className="devices-grid">
                    {devices.map((device) => (
                      <DeviceCard key={device._id} device={device} onToggle={handleToggle} />
                    ))}
                  </div>
                </section>

                <aside className="gauge-section">
                  <PowerGauge total={totalPower} />
                </aside>
              </div>
            )}
          </>
        ) : (
          <div className="report-container">
            <div className="report-card">
              <h3 className="card-inner-title">Hourly Usage Analytics</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Time Interval</th>
                    <th>Avg. Power (W)</th>
                    <th>Peak Power (W)</th>
                    <th>Efficiency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hourlyReport.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.time}</td>
                      <td>{row.avgPower} W</td>
                      <td>{row.peakPower} W</td>
                      <td>{row.efficiency}</td>
                      <td>
                        <span className={`status-pill ${row.status === 'High Usage' ? 'high' : 'normal'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
