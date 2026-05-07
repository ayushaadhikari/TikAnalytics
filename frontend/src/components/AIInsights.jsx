import { useState } from 'react';

// Configuration constants
const CONFIG = {
  SPACING: {
    XS: '8px',
    SM: '12px',
    MD: '16px',
    LG: '24px',
    XL: '32px'
  },
  BORDER_RADIUS: {
    SM: '8px',
    MD: '12px',
    LG: '16px',
    XL: '20px'
  },
  FONT_SIZES: {
    SM: '14px',
    MD: '16px',
    LG: '18px',
    XL: '28px'
  },
  COLORS: {
    PRIMARY_GRADIENT: 'linear-gradient(45deg, #FF0050, #00F2EA)',
    BACKGROUND_GRADIENT: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    CARD_BACKGROUND: 'rgba(55, 65, 81, 0.5)',
    TRANSPARENT_CARD: 'rgba(55, 65, 81, 0.3)',
    BORDER: 'rgba(75, 85, 99, 0.3)',
    TEXT_PRIMARY: '#F3F4F6',
    TEXT_SECONDARY: '#9CA3AF',
    WHITE: '#FFFFFF'
  }
};

const INSIGHT_ICONS = {
  user: { emoji: '🎯', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
  engagement: { emoji: '⚡', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  maturity: { emoji: '📊', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
  activity: { emoji: '🕒', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
  content: { emoji: '🎬', gradient: 'linear-gradient(135deg, #EC4899, #DB2777)' },
  behavioral: { emoji: '🧠', gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)' }
};

const INSIGHT_DATA = [
  { key: 'user_type', label: 'User Type', type: 'user' },
  { key: 'engagement_style', label: 'Engagement Style', type: 'engagement' },
  { key: 'user_maturity', label: 'User Maturity', type: 'maturity' },
  { key: 'activity_patterns', label: 'Activity Patterns', type: 'activity' },
  { key: 'content_preferences', label: 'Content Preferences', type: 'content' },
  { key: 'behavioral_insights', label: 'Behavioral Insights', type: 'behavioral' }
];

// Style factory functions
const createContainerStyle = () => ({
  background: CONFIG.COLORS.BACKGROUND_GRADIENT,
  borderRadius: CONFIG.BORDER_RADIUS.XL,
  padding: CONFIG.SPACING.XL,
  border: `1px solid ${CONFIG.COLORS.BORDER}`,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  marginBottom: CONFIG.SPACING.XL
});

const createHeaderStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: CONFIG.SPACING.XL,
  gap: CONFIG.SPACING.MD
});

const createTitleStyle = () => ({
  fontSize: CONFIG.FONT_SIZES.XL,
  fontWeight: '700',
  color: CONFIG.COLORS.WHITE,
  margin: 0,
  background: CONFIG.COLORS.PRIMARY_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
});

const createIconStyle = (size = '48px') => ({
  width: size,
  height: size,
  background: CONFIG.COLORS.PRIMARY_GRADIENT,
  borderRadius: CONFIG.BORDER_RADIUS.MD,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
});

const createGridStyle = () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: CONFIG.SPACING.LG,
  marginBottom: CONFIG.SPACING.XL
});

const createCardStyle = () => ({
  background: CONFIG.COLORS.CARD_BACKGROUND,
  backdropFilter: 'blur(10px)',
  borderRadius: CONFIG.BORDER_RADIUS.LG,
  padding: CONFIG.SPACING.LG,
  border: `1px solid ${CONFIG.COLORS.BORDER}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden'
});

const createIconContainerStyle = (gradient) => ({
  width: '40px',
  height: '40px',
  borderRadius: CONFIG.BORDER_RADIUS.MD,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: CONFIG.SPACING.MD,
  fontSize: '18px',
  background: gradient
});

const createTitleTextStyle = () => ({
  fontSize: CONFIG.FONT_SIZES.SM,
  fontWeight: '600',
  color: CONFIG.COLORS.TEXT_SECONDARY,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: CONFIG.SPACING.SM
});

const createBodyTextStyle = () => ({
  fontSize: CONFIG.FONT_SIZES.MD,
  color: CONFIG.COLORS.TEXT_PRIMARY,
  lineHeight: '1.6',
  fontWeight: '500'
});

const createRecommendationsContainerStyle = () => ({
  background: CONFIG.COLORS.TRANSPARENT_CARD,
  borderRadius: CONFIG.BORDER_RADIUS.LG,
  padding: CONFIG.SPACING.LG,
  border: `1px solid ${CONFIG.COLORS.BORDER}`
});

const createRecommendationItemStyle = () => ({
  background: 'rgba(31, 41, 55, 0.8)',
  borderRadius: CONFIG.BORDER_RADIUS.MD,
  padding: `${CONFIG.SPACING.MD} ${CONFIG.SPACING.LG}`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: CONFIG.SPACING.MD,
  border: `1px solid ${CONFIG.COLORS.BORDER}`,
  transition: 'all 0.2s ease'
});

const createBulletStyle = () => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: CONFIG.COLORS.PRIMARY_GRADIENT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: '2px'
});

export default function AIInsights({ insights }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!insights) return null;

  const handleCardHover = (cardIndex) => {
    setHoveredCard(cardIndex);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const getCardStyle = (index) => {
    const baseStyle = createCardStyle();
    return hoveredCard === index 
      ? { ...baseStyle, transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }
      : baseStyle;
  };

  const handleRecommendationHover = (e, isHovering) => {
    if (isHovering) {
      e.target.style.transform = 'translateX(4px)';
      e.target.style.borderColor = 'rgba(255, 0, 80, 0.3)';
    } else {
      e.target.style.transform = 'translateX(0)';
      e.target.style.borderColor = CONFIG.COLORS.BORDER;
    }
  };

  return (
    <div style={createContainerStyle()}>
      <div style={createHeaderStyle()}>
        <div style={createIconStyle()}>
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        <h2 style={createTitleStyle()}>AI-Powered Insights</h2>
      </div>

      <div style={createGridStyle()}>
        {INSIGHT_DATA.map((insight, index) => {
          const iconData = INSIGHT_ICONS[insight.type];
          return (
            <div 
              key={insight.key} 
              style={getCardStyle(index)}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
            >
              <div style={createIconContainerStyle(iconData.gradient)}>
                <span>{iconData.emoji}</span>
              </div>
              <div style={createTitleTextStyle()}>{insight.label}</div>
              <div style={createBodyTextStyle()}>{insights[insight.key]}</div>
            </div>
          );
        })}
      </div>

      {insights.recommendations && insights.recommendations.length > 0 && (
        <div style={createRecommendationsContainerStyle()}>
          <div style={createHeaderStyle()}>
            <div style={createIconContainerStyle(CONFIG.COLORS.PRIMARY_GRADIENT)}>
              <span>💡</span>
            </div>
            <h3 style={{ fontSize: CONFIG.FONT_SIZES.LG, fontWeight: '600', color: CONFIG.COLORS.WHITE, margin: 0 }}>
              Personalized Recommendations
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: CONFIG.SPACING.MD }}>
            {insights.recommendations.map((recommendation, index) => (
              <div 
                key={index} 
                style={createRecommendationItemStyle()}
                onMouseEnter={(e) => handleRecommendationHover(e, true)}
                onMouseLeave={(e) => handleRecommendationHover(e, false)}
              >
                <div style={createBulletStyle()}>
                  <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span style={{ fontSize: '15px', color: '#E5E7EB', lineHeight: '1.5', flex: 1 }}>
                  {recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
