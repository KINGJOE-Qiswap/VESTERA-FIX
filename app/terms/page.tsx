export default function TermsPage() {
  return (
    <main style={{fontFamily:'system-ui, -apple-system', background:'#F8FFFE', color:'#0A4D4E', lineHeight:1.7}}>
      <header style={{background:'#0A4D4E', color:'#fff', padding:'16px 24px', display:'flex', justifyContent:'space-between', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}><span style={{background:'#00E5CC', color:'#0A4D4E', width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800}}>V</span><b>VESTERA</b></div>
        <a href="/" style={{background:'#00E5CC', color:'#0A4D4E', padding:'8px 16px', borderRadius:'20px', textDecoration:'none', fontWeight:700}}>← Home</a>
      </header>

      <div style={{maxWidth:'850px', margin:'0 auto', padding:'24px'}}>
        <div style={{textAlign:'center', marginBottom:'32px', paddingBottom:'24px', borderBottom:'3px solid #00E5CC'}}>
          <h1 style={{fontSize:'2.2rem', marginBottom:'8px'}}>Terms of Service</h1>
          <p style={{color:'#666'}}><strong>Last Updated: November 1, 2026</strong> | <span style={{background:'#00E5CC', color:'#0A4D4E', padding:'4px 12px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:700}}>UTILITY CATEGORY</span></p>
          <p style={{background:'#E6FFFE', padding:'12px', borderRadius:'12px', marginTop:'16px'}}><b>VESTERA</b> is a Pi Network Utility App — Real estate solution for diaspora via Pi Auth & Pi Payments</p>
        </div>

        <div style={{background:'#fff', borderRadius:'16px', padding:'32px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', borderLeft:'5px solid #00E5CC'}}>

          <h2>1. ACCEPTANCE - UTILITY AGREEMENT</h2>
          <p>By accessing VESTERA via Pi Browser, you agree to these Terms. VESTERA provides REAL utility: verified affordable lands/houses in Africa for diaspora, Pi escrow, document verification. You must be 18+ and have Pi KYC.</p>

          <h2>2. SERVICES - REAL WORLD UTILITY</h2>
          <p>VESTERA allows: (a) Search verified properties, (b) Inquire via Pi-authenticated chat, (c) Pay deposit via Pi SDK (d) Escrow until title verified, (e) Track transaction on Pi blockchain. We are NOT a broker — we are a verification & escrow utility layer.</p>

          <h2>3. PI AUTHENTICATION & PAYMENTS - CORE UTILITY</h2>
          <p><b>Auth:</b> Login via Pi Network SDK only. No passwords stored.<br/><b>Payments:</b> All Pi payments via official Pi SDK createPayment. No private keys collected. Escrow released only after: physical verification, document check, buyer confirmation. Transaction hashes stored on Pi blockchain for transparency. Platform fee 2-5% shown before payment.</p>

          <h2>4. USER RESPONSIBILITIES</h2>
          <p>You must provide accurate Pi username, conduct due diligence, not submit false listings. Diaspora buyers must complete ID verification for escrow. Any fraud = instant ban + report to Pi Core Team.</p>

          <h2>5. LISTING VERIFICATION</h2>
          <p>Every listing passes: (a) CAC check, (b) Land registry check, (c) Physical video inspection, (d) Seller ID verification. Verified badge = passed all 4. Non-verified = use at your own risk.</p>

          <h2>6. ESCROW & REFUNDS</h2>
          <p>Pi held in escrow until 7-day inspection period. Refund if: title fails, seller fake, property not as described. Refund via Pi wallet within 48hrs. No refund after you sign digital
