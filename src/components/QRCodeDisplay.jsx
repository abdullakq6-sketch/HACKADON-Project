import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeDisplay({ assetId, assetName }) {
  const url = `${window.location.origin}/asset/${assetId}`;

  const handleDownload = () => {
    const canvas = document.getElementById(`qr-${assetId}`);
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${assetName || "asset"}-QR.png`;
    link.click();
  };

  return (
    <div className="qr-box">
      <QRCodeCanvas id={`qr-${assetId}`} value={url} size={110} />
      <button onClick={handleDownload} className="link" style={{ background: "none", border: "none", cursor: "pointer" }}>
        Download QR
      </button>
    </div>
  );
}