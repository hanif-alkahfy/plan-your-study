// pages/SetUpBot.jsx
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));
const userId = `user-${user?.id}`;

const socket = io("http://192.168.0.100:5000");

const SetUpBot = () => {
  const [useOwnNumber, setUseOwnNumber] = useState(false);
  const [qrData, setQrData] = useState("");
  const [botStatus, setBotStatus] = useState("Belum Terhubung");

    useEffect(() => {
      socket.on(`connect`, () => {
        console.log("Socket terhubung:", socket.id);
      });

      socket.on(`qr-${userId}`, (data) => {
        console.log("QR Code diterima:", data);
        setQrData(data);
      });

      socket.on(`ready-${userId}`, () => {
        console.log("Bot siap");
        setBotStatus("Tersambung");
      });

      return () => {
          socket.off(`qr-${userId}`);
          socket.off(`ready-${userId}`);
      };
      }, []);

  const handleStartBot = async () => {
    setBotStatus("Menunggu QR...");
    // trigger backend untuk buat session WA
    await fetch("http://192.168.0.100:5000/api/whatsapp/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Set Up WhatsApp Bot</h1>

      <div className="mb-4">
        <label className="mr-4 font-semibold">Gunakan nomor Anda sendiri?</label>
        <input
          type="checkbox"
          checked={useOwnNumber}
          onChange={(e) => setUseOwnNumber(e.target.checked)}
        />
      </div>

      {useOwnNumber && (
        <div className="bg-white shadow-md rounded-lg p-4 inline-block">
          <p className="mb-2 text-sm text-gray-700">Scan QR Code berikut untuk login:</p>
          {qrData ? <QRCode value={qrData} size={256} /> : <p>Menunggu QR...</p>}
        </div>
      )}

      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleStartBot}
          disabled={!useOwnNumber}
        >
          Start Bot
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">Status bot: <b>{botStatus}</b></p>
    </div>
  );
};

export default SetUpBot;
