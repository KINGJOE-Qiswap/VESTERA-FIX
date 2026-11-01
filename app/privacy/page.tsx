export default function PrivacyPolicy() {
  return (
    <main style={{fontFamily:'system-ui, -apple-system', background:'#F8FFFE', color:'#0A4D4E', lineHeight:1.7}}>
      <header style={{background:'#0A4D4E', color:'#fff', padding:'16px 24px', display:'flex', justifyContent:'space-between', position:'sticky', top:0}}>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}><span style={{background:'#00E5CC', color:'#0A4D4E', width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800}}>V</span><b>VESTERA</b></div>
        <a href="/" style={{background:'#00E5CC', color:'#0A4D4E', padding:'8px 16px', borderRadius:'20px', textDecoration:'none', fontWeight:700}}>← Home</a>
      </header>
      <div style={{maxWidth:'850px', margin:'0 auto', padding:'24px'}}>
        <div style={{textAlign:'center', marginBottom:'32px', paddingBottom:'24px', borderBottom:'3px solid #00E5CC'}}>
          <h1 style={{fontSize:'2.2rem', marginBottom:'8px'}}>Privacy Policy</h1>
          <p style={{color:'#666'}}><strong>Last Updated: November 1, 2026</strong> | <span style={{background:'#00E5CC', color:'#0A4D4E', padding:'4px 12px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:700}}>UTILITY CATEGORY</span></p>
          <p>VESTERA is a Pi Network Utility App solving real-world housing for diaspora via Pi Auth & Pi Payments</p>
        </div>
        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', borderLeft:'5px solid #00E5CC'}}>
          <h2>1. INTRODUCTION - UTILITY PURPOSE</h2><p>VESTERA connects diaspora (USA, UK, Canada) to verified affordable lands/houses in Africa. We provide REAL-WORLD UTILITY through property search, verified listings, Pi escrow, document verification.</p>
          <h2>2. INFORMATION WE COLLECT</h2><p><b>A. Pi Network Data:</b> Pi username, wallet address, KYC status, access token via Pi SDK.<br/><b>B. Property Data:</b> Listings viewed, saved, inquiries.<br/><b>C. Optional for Escrow:</b> Email, phone, government ID for title verification (only when you transact).<br/><b>D. Technical:</b> Device, IP, Pi Browser version for fraud prevention.<br/>We NEVER collect Pi passphrase/private keys.</p>
          <h2>3. HOW WE USE</h2><p>Authenticate via Pi, facilitate inquiries, execute Pi escrow, verify listings, send transaction updates, comply with Pi Terms & Nigerian law.</p>
          <h2>4. PI PAYMENTS & BLOCKCHAIN - CORE UTILITY</h2><p>All payments via official Pi SDK. Escrow via smart contract until verification complete. Hashes on Pi blockchain for transparency. Fees 2-5% disclosed before payment. No private keys stored.</p>
          <h2>5. DATA SHARING</h2><p>NEVER sell data. Shared only with verified agents (when you inquire), Pi Network (auth), legal authorities if required.</p>
          <h2>6. SECURITY</h2><p>Encryption at rest/in transit, secure escrow.</p>
          <h2>7. RETENTION & DELETION</h2><p>Active + 24 months. Deletion request: support@vestera.com. Blockchain hashes immutable.</p>
          <h2>8. YOUR RIGHTS</h2><p>GDPR/CCPA rights: Access, correct, delete via support@vestera.com</p>
          <h2>9. CHILDREN</h2><p>18+ only, Pi requires KYC.</p>
          <h2>10. CONTACT</h2><p>Email: support@vestera.com<br/>VESTERA - Property For All & Diaspora<br/>Utility Powered by Pi</p>
        </div>
      </div>
      <footer style={{background:'#0A4D4E', color:'#fff', textAlign:'center', padding:'24px', marginTop:'48px'}}>© 2026 VESTERA - Real Utility. Real Homes. Powered by Pi.</footer>
    </main>
  )
}
