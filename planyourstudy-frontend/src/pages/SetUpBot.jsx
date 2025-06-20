import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;
const token = localStorage.getItem("token");
const API_BASE = import.meta.env.VITE_BASE_API_URL;

const socket = io("http://localhost:5000");

const SetUpBot = () => {
  const [botType, setBotType] = useState(null); // "default" | "custom"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrData, setQrData] = useState("");
  const [botStatus, setBotStatus] = useState("Belum Terhubung");
  const [notif, setNotif] = useState("");
  const [isBotReady, setIsBotReady] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔌 Socket terhubung:", socket.id);
    });

    socket.on(`qr-user-${userId}`, (data) => {
      setQrData(data);
      setBotStatus("Menunggu scan QR...");
    });

    socket.on(`ready-user-${userId}`, () => {
      setBotStatus("Tersambung");
      setIsBotReady(true);
    });

    return () => {
      socket.off(`qr-user-${userId}`);
      socket.off(`ready-user-${userId}`);
    };
  }, []);

  const handleGenerateQR = async () => {
    setNotif("");
    setQrData("");
    setBotStatus("Menunggu QR...");
    setIsBotReady(false);

    try {
      await fetch(`${API_BASE}/whatsapp/init-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      setNotif("❌ Gagal generate QR");
    }
  };

  const handleSave = async () => {
    setNotif("");
    if (!phoneNumber) return setNotif("❌ Nomor WA tidak boleh kosong");

    try {
      const res = await fetch(`${API_BASE}/recipients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          type: botType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal simpan nomor");

      setNotif("✅ Nomor berhasil disimpan");
    } catch (err) {
      setNotif("❌ " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Setup WhatsApp Bot</h1>

      {!botType && (
        <div className="flex flex-col gap-3 mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setBotType("default");
              setShowPhoneForm(true);
            }}
          >
            Gunakan Bot Default
          </button>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              setBotType("custom");
              handleGenerateQR();
            }}
          >
            Gunakan Bot Sendiri
          </button>
        </div>
      )}

      {botType === "custom" && !showPhoneForm && (
        <>
          <p className="text-sm mb-2 text-gray-700">Status Bot: <b>{botStatus}</b></p>

          {qrData ? (
            <div className="mb-4">
              <p className="mb-2">Scan QR Code berikut:</p>
              <QRCode value={qrData} size={256} />
            </div>
          ) : (
            <p className="mb-4">⏳ Menunggu QR...</p>
          )}

          {isBotReady && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
              onClick={() => setShowPhoneForm(true)}
            >
              Lanjutkan
            </button>
          )}
        </>
      )}

      {showPhoneForm && (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="6281234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
            onClick={handleSave}
          >
            Simpan Nomor
          </button>
        </>
      )}

      {notif && <p className="mt-4 text-sm">{notif}</p>}
    </div>
  );
};

export default SetUpBot;
