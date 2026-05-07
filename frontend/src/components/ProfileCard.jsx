export default function ProfileCard({ profile }) {
  const cardStyle = {
    backgroundColor: '#1F2937',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #374151',
    marginBottom: '24px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px'
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1F2937',
    backgroundImage: profile?.profile_photo ? `url(${profile.profile_photo})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: profile?.profile_photo ? '3px solid #FF0050' : 'none'
  };

  const userInfoStyle = {
    flex: 1
  };

  const usernameStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const bioStyle = {
    color: '#9CA3AF',
    fontSize: '14px',
    marginBottom: '8px'
  };

  const verifiedBadgeStyle = {
    background: 'linear-gradient(45deg, #FF0050, #00F2EA)',
    color: 'white',
    fontSize: '12px',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '20px'
  };

  const statStyle = {
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '12px',
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

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={avatarStyle}>
          {profile?.profile_photo ? '' : getValue(profile?.username?.[0]?.toUpperCase(), "?")}
        </div>
        <div style={userInfoStyle}>
          <div style={usernameStyle}>
            {getValue(profile?.username, "Unknown User")}
            {profile?.verified && (
              <span style={verifiedBadgeStyle}>✓</span>
            )}
          </div>
          <div style={bioStyle}>
            {getValue(profile?.bio, "No bio available")}
          </div>
        </div>
      </div>

      <div style={statsGridStyle}>
        <div style={statStyle}>
          <div style={statValueStyle}>
            {getNumberValue(profile?.followers)}
          </div>
          <div style={statLabelStyle}>Followers</div>
        </div>
        <div style={statStyle}>
          <div style={statValueStyle}>
            {getNumberValue(profile?.following)}
          </div>
          <div style={statLabelStyle}>Following</div>
        </div>
        <div style={statStyle}>
          <div style={statValueStyle}>
            {getNumberValue(profile?.likes)}
          </div>
          <div style={statLabelStyle}>Likes</div>
        </div>
      </div>
    </div>
  );
}
