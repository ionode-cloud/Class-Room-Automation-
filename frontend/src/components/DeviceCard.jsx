export default function DeviceCard({ device, onToggle }) {
  const isLight = device.type === 'light';
  const isFan   = device.type === 'fan';

  const iconClass = isLight ? 'fa-solid fa-lightbulb icon-light' : isFan ? 'fa-solid fa-fan icon-fan' : 'fa-solid fa-snowflake icon-ac';
  const colorClass = isLight ? 'card-light' : isFan ? 'card-fan' : 'card-ac';

  return (
    <div
      className={`device-card ${colorClass} ${device.isOn ? 'device-on' : 'device-off'}`}
      onClick={() => onToggle(device._id)}
    >
      {/* Icon circle */}
      <div className="device-icon-wrap">
        <div className={`device-icon ${isFan && device.isOn ? 'spin' : ''}`}>
          <i className={iconClass} style={{ fontSize: '28px' }}></i>
        </div>
      </div>

      {/* Name */}
      <div className="device-name">{device.name}</div>

      {/* Power */}
      <div className="power-badge">
        Power Consumption: {device.powerConsumption} W
      </div>

      {/* Toggle Switch */}
      <div className={`toggle-switch ${device.isOn ? 'toggle-on' : ''}`}>
        <div className="toggle-knob" />
      </div>

      {/* Status pill */}
      <div className={`device-status ${device.isOn ? 'status-on' : 'status-off'}`}>
        {device.isOn ? 'ON' : 'OFF'}
      </div>
    </div>
  );
}
