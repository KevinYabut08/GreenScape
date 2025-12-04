import { useState } from "react";
import AxiosInstance from "../components/AxiosInstance";

const Settings = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); 

  const handleChangePassword = async () => {
    setMessage("");
    setMsgType("");

    try {
      const token = localStorage.getItem("token");

      await AxiosInstance.post(
        "change-password/",
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMsgType("success");
      setMessage("Password changed successfully!");

      setTimeout(() => setOverlayOpen(false), 1000);
    } catch (err) {
      setMsgType("error");
        if (err.response?.data) {
        const errors = err.response.data;
        let formatted = "Error:\n";
        for (const field in errors) {
        formatted += `${field.replace("_", " ").toUpperCase()}: ${errors[field][0]}\n`;
        }
        setMessage(formatted);
        } else {
        setMessage("An error occurred.");
        }
        }
    };
    
  return (
    <div>
      <p className="titleWrapper">SETTINGS</p>

      <div className="settingsWrapper">
        <button 
          className="changeBtn"
          onClick={() => setOverlayOpen(true)}
          style={{ width: "200px" }}
        >
          CHANGE PASSWORD
        </button>

        {overlayOpen && (
          <div className="overlay">
            <div className="overlayContent">

              <h2>Change Password</h2>

              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button onClick={handleChangePassword}>UPDATE PASSWORD</button>

              {message && (
                <p className={`statusMsg ${msgType === "error" ? "errorMsg" : "successMsg"}`}>
                  {message}
                </p>
              )}

              <p className="closeModal" onClick={() => setOverlayOpen(false)}>
                CLOSE
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
