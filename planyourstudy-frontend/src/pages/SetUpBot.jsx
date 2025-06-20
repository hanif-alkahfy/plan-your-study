import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;
const token = localStorage.getItem("token");
const API_BASE = import.meta.env.VITE_BASE_API_URL;

const socket = io("http://localhost:5000");

const SetUpBot = () => {
  const [useOwnNumber, setUseOwnNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrData, setQrData] = useState("");
  const [botStatus, setBotStatus] = useState("Belum Terhubung");
  const [notif, setNotif] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket terhubung:", socket.id);
    });

    socket.on(`qr-user-${userId}`, (data) => {
      setQrData(data);
      setBotStatus("Menunggu scan QR...");
    });

    socket.on(`ready-user-${userId}`, () => {
      setBotStatus("Tersambung");
    });

    return () => {
      socket.off(`qr-user-${userId}`);
      socket.off(`ready-user-${userId}`);
    };
  }, [userId]);

  const handleGenerateQR = async () => {
    setNotif("");
    setQrData("");
    setBotStatus("Menunggu QR...");

    try {
      await fetch(`${API_BASE}/whatsapp/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId }), // sesuai backend
      });
    } catch (error) {
      setNotif("❌ Gagal generate QR");
    }
  };

  const handleSave = async () => {
    setNotif("");
    if (!phoneNumber) return setNotif("❌ Nomor WA tidak boleh kosong");

    if (useOwnNumber && botStatus !== "Tersambung") {
      return setNotif("❌ Bot belum terhubung. Login WA dulu");
    }

    // 🔍 Debug token & body sebelum request
    console.log("🔐 Token dikirim:", token);
    console.log("📦 Body dikirim:", {
      phoneNumber,
      type: useOwnNumber ? "custom" : "default",
    });

    try {
      const res = await fetch(`${API_BASE}/recipients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          type: useOwnNumber ? "custom" : "default",
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

      <div className="mb-4">
        <label className="font-medium mr-3">Gunakan nomor Anda sendiri?</label>
        <input
          type="checkbox"
          checked={useOwnNumber}
          onChange={(e) => {
            setUseOwnNumber(e.target.checked);
            setBotStatus("Belum Terhubung");
            setQrData("");
            setNotif("");
          }}
        />
      </div>

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

      {useOwnNumber && (
        <>
          <div className="mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleGenerateQR}
            >
              Generate QR Code
            </button>
          </div>

          <div className="mb-4">
            {qrData ? (
              <>
                <p className="mb-2 text-sm text-gray-700">Scan QR Code berikut:</p>
                <QRCode value={qrData} size={256} />
              </>
            ) : (
              <p>Menunggu QR...</p>
            )}
          </div>
        </>
      )}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
        onClick={handleSave}
        disabled={useOwnNumber && botStatus !== "Tersambung"}
      >
        Simpan Nomor
      </button>

      {notif && <p className="mt-4 text-sm">{notif}</p>}

      <p className="mt-2 text-sm text-gray-600">Status bot: <b>{botStatus}</b></p>
    </div>
  );
};

export default SetUpBot;
