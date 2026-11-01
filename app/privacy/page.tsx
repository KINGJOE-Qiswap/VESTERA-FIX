export default function PrivacyPage() {
  return (
    <div style={{padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.6'}}>
      <a href="/" style={{background: '#00E5CC', color: '#0A4D4E', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: '700'}}>Home</a>
      <h1>Privacy Policy - VESTERA</h1>
      <p><strong>Last Updated: November 1, 2026</strong></p>
      <p>VESTERA is a Pi Network Utility App. We use Pi Authentication and Pi Payments only.</p>
      <h2>Data We Collect</h2>
      <p>Pi username, Pi wallet address for escrow, property inquiries. No passwords stored.</p>
      <h2>How We Use Data</h2>
      <p>Verify listings, escrow Pi payments, prevent fraud, show blockchain transaction hashes.</p>
      <h2>Pi SDK</h2>
      <p>We use official Pi Network SDK for auth and payments. We never access your private keys.</p>
      <h2>Contact</h2>
      <p>support@vestera.com - Lagos, Nigeria</p>
      <footer style={{marginTop: '40px', padding: '20px', background: '#0A4D4E', color: 'white', textAlign: 'center'}}>2026 VESTERA</footer>
    </div>
  )
}
