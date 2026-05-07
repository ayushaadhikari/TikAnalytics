export default function StatsGrid({ stats }) {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  };

  const cardStyle = {
    backgroundColor: '#1F2937',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #374151',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const iconStyle = {
    fontSize: '32px',
    marginBottom: '12px'
  };

  const valueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#9CA3AF',
    textTransform: 'uppercase'
  };

  // Helper function to get value or show "Not Available"
  const getValue = (value, defaultValue = "Not Available") => {
    return value !== undefined && value !== null && value !== "" ? value : defaultValue;
  };

  const getNumberValue = (value, defaultValue = "Not Available") => {
    return value !== undefined && value !== null ? value.toLocaleString() : defaultValue;
  };

  const statsData = [
    {
      icon: '❤️',
      label: 'Liked Videos',
      value: getNumberValue(stats?.liked_videos_count)
    },
    {
      icon: '⭐',
      label: 'Favorite Videos',
      value: getNumberValue(stats?.favorite_videos_count)
    },
    {
      icon: '💬',
      label: 'Comments',
      value: getNumberValue(stats?.comments_count)
    },
    {
      icon: '✉️',
      label: 'Messages',
      value: getNumberValue(stats?.messages_count)
    },
    {
      icon: '👁️',
      label: 'Profile Views',
      value: getNumberValue(stats?.profile_views_count)
    },
    {
      icon: '📤',
      label: 'Posts',
      value: getNumberValue(stats?.posts_count)
    }
  ];

  return (
    <div style={containerStyle}>
      {statsData.map((stat, index) => (
        <div
          key={index}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 8px 25px rgba(255, 0, 80, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div style={iconStyle}>{stat.icon}</div>
          <div style={valueStyle}>{stat.value}</div>
          <div style={labelStyle}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
