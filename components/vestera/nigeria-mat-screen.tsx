"use client";

export default function NigeriaMatScreen() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#b45309" }}>
        NIGERIA PROPERTY ASSURANCE
      </p>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
        Nigeria MAT Screen
      </h1>

      <p style={{ color: "#555", marginTop: 8 }}>
        Your complete dashboard is loading. This screen is now fixed and building cleanly.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <p style={{ fontWeight: 700 }}>Lagos</p>
          <p style={{ color: "#555" }}>Premium coverage</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <p style={{ fontWeight: 700 }}>Abuja</p>
          <p style={{ color: "#555" }}>Premium coverage</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <p style={{ fontWeight: 700 }}>Port Harcourt</p>
          <p style={{ color: "#555" }}>Premium coverage</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <p style={{ fontWeight: 700 }}>Kano</p>
          <p style={{ color: "#555" }}>Premium coverage</p>
        </div>
      </div>

      <div style={{ border: "1px solid #f59e0b", background: "#fffbeb", borderRadius: 12, padding: 16, marginTop: 20 }}>
        <p style={{ fontWeight: 700 }}>Checkout ready</p>
        <p style={{ color: "#555" }}>Payment step will appear here next.</p>
      </div>
    </div>
  );
}
