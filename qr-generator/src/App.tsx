import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Check, Download, Image as ImageIcon, LockKeyhole, QrCode, RotateCcw } from "lucide-react";
import * as QRCode from "qrcode";

type Mode = "url" | "text" | "wifi" | "contact";
type WifiSecurity = "WPA" | "WEP" | "nopass";

const modes: Array<{ value: Mode; label: string }> = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "contact", label: "Contact" },
];

function escapeWifi(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/:/g, "\\:");
}

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState<WifiSecurity>("WPA");
  const [hidden, setHidden] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    if (mode === "url") return url.trim();
    if (mode === "text") return text.trim();
    if (mode === "wifi") {
      if (!ssid.trim()) return "";
      return `WIFI:T:${security};S:${escapeWifi(ssid.trim())};P:${escapeWifi(password)};H:${hidden ? "true" : "false"};;`;
    }
    if (![name, phone, email, organization].some((value) => value.trim())) return "";
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      name.trim() && `FN:${escapeVCard(name.trim())}`,
      phone.trim() && `TEL:${escapeVCard(phone.trim())}`,
      email.trim() && `EMAIL:${escapeVCard(email.trim())}`,
      organization.trim() && `ORG:${escapeVCard(organization.trim())}`,
      "END:VCARD",
    ].filter(Boolean).join("\n");
  }, [email, hidden, mode, name, organization, password, phone, security, ssid, text, url]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setMessage("");
    setError("");
    if (!payload) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
      setGenerating(false);
      return;
    }

    setGenerating(true);
    let cancelled = false;
    QRCode.toCanvas(canvas, payload, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#17233b", light: "#ffffff" },
    }, (generationError) => {
      if (cancelled) return;
      setGenerating(false);
      if (generationError) setError("This content could not be turned into a QR code.");
    });
    return () => { cancelled = true; };
  }, [payload]);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setMessage("");
    setError("");
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !payload) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("The QR image could not be prepared for download.");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `qr-${mode}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setMessage("QR code downloaded.");
    }, "image/png");
  };

  const reset = () => {
    setUrl(""); setText(""); setSsid(""); setPassword(""); setName(""); setPhone(""); setEmail(""); setOrganization("");
    setHidden(false); setSecurity("WPA"); setMessage(""); setError("");
  };

  const input = (label: string, value: string, onChange: (event: ChangeEvent<HTMLInputElement>) => void, placeholder: string, type = "text") => (
    <label className="field-label">{label}<input type={type} value={value} onChange={onChange} placeholder={placeholder} /></label>
  );

  return (
    <div className="qr-app">
      <header className="simple-header">
        <a className="simple-brand" href="/" aria-label="QR Generator home"><span className="brand-mark"><QrCode size={16} /></span><span>QR Generator</span></a>
        <span className="local-note"><LockKeyhole size={14} /> Works in your browser</span>
      </header>

      <main className="simple-main">
        <div className="simple-title"><div><p className="tool-label">TOOL #59</p><h1>QR Generator</h1><p className="intro">Create a QR code for a link, message, Wi-Fi network, or contact.</p></div></div>

        <div className="qr-card">
          <section className="form-column">
            <div className="column-heading"><strong>What should it contain?</strong><span>Local only</span></div>
            <div className="mode-tabs" role="tablist" aria-label="QR code type">
              {modes.map((item) => <button type="button" role="tab" aria-selected={mode === item.value} className={mode === item.value ? "selected" : ""} key={item.value} onClick={() => changeMode(item.value)}>{item.label}</button>)}
            </div>

            {mode === "url" && <>{input("Website or URL", url, (event) => setUrl(event.target.value), "https://example.com", "url")}<p className="field-hint">Include https:// for the most reliable scan.</p></>}
            {mode === "text" && <label className="field-label">Your text<textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a message or note" rows={6} /></label>}
            {mode === "wifi" && <>
              {input("Network name (SSID)", ssid, (event) => setSsid(event.target.value), "My Wi-Fi")}
              <div className="two-fields"><label className="field-label">Security<select value={security} onChange={(event) => setSecurity(event.target.value as WifiSecurity)}><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">No password</option></select></label>{input("Password", password, (event) => setPassword(event.target.value), "Network password", "password")}</div>
              <label className="check-control"><input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} /><span className="checkmark">{hidden ? "✓" : ""}</span> Hidden network</label>
            </>}
            {mode === "contact" && <>
              {input("Name", name, (event) => setName(event.target.value), "Aisha Khan")}
              <div className="two-fields">{input("Phone", phone, (event) => setPhone(event.target.value), "+1 555 123 4567", "tel")}{input("Email", email, (event) => setEmail(event.target.value), "aisha@example.com", "email")}</div>
              {input("Organization (optional)", organization, (event) => setOrganization(event.target.value), "Company name")}
            </>}
            <button className="reset-button" type="button" onClick={reset}><RotateCcw size={14} /> Clear form</button>
          </section>

          <section className="preview-column">
            <div className="column-heading"><strong>Preview</strong><span>{payload ? "Ready to scan" : "Enter content first"}</span></div>
            <div className={`qr-preview ${payload ? "ready" : "empty"}`}>
              {payload ? <canvas ref={canvasRef} aria-label="Generated QR code" /> : <><QrCode size={38} /><span>Your QR code will appear here</span></>}
            </div>
            <div className="preview-actions"><span><Check size={14} /> Generated on this device</span><button className="download-button" type="button" onClick={download} disabled={!payload || generating}><Download size={15} /> {generating ? "Generating…" : "Download PNG"}</button></div>
          </section>
        </div>

        {error && <p className="feedback error" role="alert">{error}</p>}
        {message && <p className="feedback success" role="status">{message}</p>}
        <footer className="simple-footer"><span><LockKeyhole size={13} /> Nothing is uploaded. Your QR content stays in this tab.</span><span>Local tool #59</span></footer>
      </main>
    </div>
  );
}
