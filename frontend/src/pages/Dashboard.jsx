import { useState, useEffect } from "react"
import JsonUpload from "../components/JsonUpload"
import ProfileCard from "../components/ProfileCard"
import StatsGrid from "../components/StatsGrid"
import AIInsights from "../components/AIInsights"
import Tabs from "../components/Tabs"
import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upload')
  const { user, logout, token } = useAuth()

  useEffect(() => {
    if (token) {
      fetchUserData()
    }
  }, [token])

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8000/my-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.message) {
          // No data uploaded yet
          setData(null)
        } else {
          setData(userData)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleDataUpload = (newData) => {
    setData(newData)
    setActiveTab('insights') // Auto-switch to insights after upload
  }

  const tabs = [
    { id: 'upload', label: '📤 Upload' },
    { id: 'insights', label: '📊 Insights' },
    { id: 'ai', label: '🤖 AI Insights' }
  ]

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid #374151'
  }

  const containerStyle = {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '0 16px',
    paddingTop: '16px',
    paddingBottom: '32px'
  }

  const headerContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const logoStyle = {
    width: '32px',
    height: '32px',
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white'
  }

  const buttonStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  }

  const tabContentStyle = {
    minHeight: '400px'
  }

  const centerStyle = {
    textAlign: 'center',
    marginBottom: '24px'
  }

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px'
  }

  const subtitleStyle = {
    color: '#9CA3AF'
  }

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 0'
  }

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    border: '4px solid transparent',
    borderTop: '4px solid #FF0050',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '80px 0'
  }

  const emptyIconStyle = {
    width: '96px',
    height: '96px',
    margin: '0 auto 24px',
    backgroundColor: '#1F2937',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9CA3AF',
    fontSize: '14px'
  }

  if (dataLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={spinnerStyle}></div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
      {/* TikTok-style Header */}
      <div style={headerStyle}>
        <div style={containerStyle}>
          <div style={headerContentStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={logoStyle}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="#6366f1"/>
                </svg>
              </div>
              <h1 style={titleStyle}>TikAnalytics</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={userInfoStyle}>
                Welcome, {user?.username}
              </div>
              <button 
                style={buttonStyle}
                onClick={logout}
                title="Logout"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={containerStyle}>
        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div style={tabContentStyle}>
          {activeTab === 'upload' && (
            <div>
              <div style={centerStyle}>
                <h2 style={headingStyle}>
                  {data ? "Update Your TikTok Data" : "Upload Your TikTok Data"}
                </h2>
                <p style={subtitleStyle}>
                  {data ? "Upload new data to update your insights" : "Get insights into your TikTok activity"}
                </p>
              </div>
              <JsonUpload onData={handleDataUpload} setIsLoading={setIsLoading} isLoading={isLoading} />
              
              {isLoading && (
                <div style={loadingStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={spinnerStyle}></div>
                    <p style={{ color: '#9CA3AF' }}>Analyzing your data...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              {data ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <ProfileCard profile={data.profile} />
                  <StatsGrid stats={data.stats} />
                </div>
              ) : (
                <div style={emptyStateStyle}>
                  <div style={{ maxWidth: '448px', margin: '0 auto' }}>
                    <div style={emptyIconStyle}>
                      <svg width="48" height="48" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>No Data Yet</h3>
                    <p style={{ color: '#9CA3AF' }}>Upload your TikTok JSON file to see your analytics</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              {data && data.ai_insights ? (
                <AIInsights insights={data.ai_insights} />
              ) : (
                <div style={emptyStateStyle}>
                  <div style={{ maxWidth: '448px', margin: '0 auto' }}>
                    <div style={emptyIconStyle}>
                      <svg width="48" height="48" fill="none" stroke="#6B7280" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>No AI Insights Yet</h3>
                    <p style={{ color: '#9CA3AF' }}>Upload your TikTok JSON file to get AI-powered insights</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
