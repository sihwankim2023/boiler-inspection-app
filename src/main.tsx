import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2563eb' }}>보일러 점검 앱</h1>
      <p>✅ 배포 성공!</p>
      <p>현재 시간: {new Date().toLocaleString('ko-KR')}</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)