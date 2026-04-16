import React, { useEffect, useState } from "react";
import '../../components/clientCss/ClientProfile.css';
import DefaultProfilePic from '../../assets/img/Profile.webp';
import AxiosInstance from "../../components/AxiosInstance";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ConfirmModal({ open, title, message, onConfirm, onCancel, saving }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">{title}</div>
        <div className="modal-text">{message}</div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="modal-confirm" onClick={onConfirm} disabled={saving}>
            {saving ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeAccount() {
  const [employeeId, setEmployeeId] = useState(localStorage.getItem("employee_id") || "");
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: localStorage.getItem("email") || "",
  });

  const [password, setPassword] = useState({ old_password: "", new_password: "", confirm: "" });
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");

  const [selectedImage, setSelectedImage] = useState(localStorage.getItem("profileImage") || null);
  const [fileError, setFileError] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);
  const [passwordConfirmOpen, setPasswordConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await AxiosInstance.get("core/employees/");
        const rows = res.data?.results || res.data || [];
        const myRow =
          rows.find((r) => String(r.employeeid) === String(employeeId)) ||
          rows[0] ||
          null;
        if (myRow) {
          setEmployeeId(String(myRow.employeeid));
          setProfile({
            firstname: myRow.firstname || "",
            lastname: myRow.lastname || "",
            phonenumber: myRow.phonenumber || "",
            email: myRow.email || localStorage.getItem("email") || "",
          });
        }
      } catch (err) {
        console.error("Account load error:", err);
        showMessage("error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3500);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File too large! Maximum size is ${formatFileSize(MAX_FILE_SIZE)}. Your file: ${formatFileSize(file.size)}`);
      setFileSize(file.size);
      return;
    }
    setFileError("");
    setFileSize(file.size);
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { setSelectedImage(ev.target.result); setIsUploading(false); };
    reader.onerror = () => { setFileError("Error reading file. Please try again."); setIsUploading(false); };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      localStorage.setItem("profileImage", selectedImage);
      window.dispatchEvent(new Event("storage"));
      showMessage("success", "Profile picture saved!");
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm("Remove your profile picture?")) {
      localStorage.removeItem("profileImage");
      window.dispatchEvent(new Event("storage"));
      setSelectedImage(null);
      setFileError("");
      setFileSize(null);
      showMessage("success", "Profile picture removed.");
    }
  };

  const hasImageChanged = () => selectedImage !== (localStorage.getItem("profileImage") || null);
  const isDefaultImage = () => !selectedImage;

  const handleUpdateEmailClick = () => {
    if (!profile.email) { showMessage("error", "Please enter a new email."); return; }
    if (!emailCurrentPassword) { showMessage("error", "Please enter your current password."); return; }
    setEmailConfirmOpen(true);
  };

  const handleEmailConfirm = async () => {
    setSaving(true);
    try {
      await AxiosInstance.patch("core/employees/me/", { email: profile.email });
      try {
        await AxiosInstance.post("change-email/", { email: profile.email, current_password: emailCurrentPassword });
      } catch {}
      localStorage.setItem("email", profile.email);
      setEmailConfirmOpen(false);
      setEmailCurrentPassword("");
      showMessage("success", "Email updated successfully.");
    } catch {
      showMessage("error", "Email update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasswordClick = () => {
    if (!password.old_password || !password.new_password || !password.confirm) {
      showMessage("error", "Please fill in all password fields."); return;
    }
    if (password.new_password !== password.confirm) {
      showMessage("error", "New passwords do not match."); return;
    }
    setPasswordConfirmOpen(true);
  };

  const handlePasswordConfirm = async () => {
    setSaving(true);
    try {
      await AxiosInstance.post("change-password/", {
        old_password: password.old_password,
        new_password: password.new_password,
      });
      setPasswordConfirmOpen(false);
      setPassword({ old_password: "", new_password: "", confirm: "" });
      showMessage("success", "Password changed successfully.");
    } catch {
      showMessage("error", "Password update failed. Check your current password and try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}`.toUpperCase();

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-title">ACCOUNT SETTINGS</div>
        <div className="profile-container">
          <div className="profile-card loading-card">
            <p>Loading account...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ConfirmModal
        open={emailConfirmOpen}
        title="Update Email"
        message={`Are you sure you want to change your email to ${profile.email}?`}
        onConfirm={handleEmailConfirm}
        onCancel={() => !saving && setEmailConfirmOpen(false)}
        saving={saving}
      />
      <ConfirmModal
        open={passwordConfirmOpen}
        title="Change Password"
        message="Are you sure you want to change your password? You'll need to use the new one next time you log in."
        onConfirm={handlePasswordConfirm}
        onCancel={() => !saving && setPasswordConfirmOpen(false)}
        saving={saving}
      />

      <div className="profile-title">ACCOUNT SETTINGS</div>

      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-card">

            {/* Message Alert */}
            {message.text && (
              <div className={`message-alert ${message.type}`}>
                <span>{message.text}</span>
                <button className="close-alert" onClick={() => setMessage({ type: "", text: "" })}>×</button>
              </div>
            )}

            <div className="profile-layout">

              {/* Left Column - Profile Image */}
              <div className="profile-image-column">
                <div className="profile-image-section">
                  <div className="profile-image-wrapper">
                    {selectedImage
                      ? <img src={selectedImage} alt="Profile" className="profile-avatar" />
                      : <div className="profile-avatar profile-avatar-initials">{initials || "?"}</div>
                    }
                  </div>

                  {fileSize && !fileError && (
                    <div className="profile-file-info">
                      <span>File size: {formatFileSize(fileSize)}</span>
                    </div>
                  )}

                  {fileError && (
                    <div className="profile-error">
                      <span>{fileError}</span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="profile-upload-progress">
                      <p>Uploading...</p>
                      <div className="progress-bar">
                        <div className="progress-fill"></div>
                      </div>
                    </div>
                  )}

                  <div className="profile-image-actions">
                    <label className={`profile-choose-btn ${isUploading ? 'disabled' : ''}`}>
                      CHOOSE IMAGE
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {!isDefaultImage() && (
                      <button
                        className={`profile-remove-btn ${isUploading ? 'disabled' : ''}`}
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                      >
                        REMOVE
                      </button>
                    )}
                  </div>

                  {hasImageChanged() && (
                    <button
                      className={`profile-save-image-btn ${isUploading || fileError ? 'disabled' : ''}`}
                      onClick={handleSaveImage}
                      disabled={isUploading || !!fileError}
                    >
                      SAVE IMAGE
                    </button>
                  )}

                  <div className="profile-size-note">
                    <span>Max size: 5MB. Formats: JPG, PNG, WEBP</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="profile-info-column">

                {/* Personal Information */}
                <div className="profile-info-section">
                  <h2 className="profile-info-title">PERSONAL INFORMATION</h2>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <span className="profile-info-label">FIRST NAME</span>
                      <span className="profile-info-value">{profile.firstname || "—"}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">LAST NAME</span>
                      <span className="profile-info-value">{profile.lastname || "—"}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">EMAIL</span>
                      <span className="profile-info-value">{profile.email || "—"}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">PHONE NUMBER</span>
                      <span className="profile-info-value">{profile.phonenumber || "—"}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-info-label">EMPLOYEE ID</span>
                      <span className="profile-info-value">{employeeId || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="profile-info-section" style={{ marginTop: "1.5rem" }}>
                  <h2 className="profile-info-title">SECURITY</h2>

                  {/* Update Email */}
                  <div className="profile-info-grid" style={{ marginBottom: "1.25rem" }}>
                    <div className="profile-info-item full-width">
                      <label className="profile-info-label">NEW EMAIL</label>
                      <input
                        className="profile-security-input"
                        type="email"
                        maxLength={50}
                        value={profile.email}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="profile-info-item">
                      <label className="profile-info-label">CURRENT PASSWORD</label>
                      <input
                        className="profile-security-input"
                        type="password"
                        maxLength={16}
                        value={emailCurrentPassword}
                        onChange={(e) => setEmailCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="profile-info-item" style={{ alignSelf: "flex-end" }}>
                      <button className="profile-security-btn-outline" onClick={handleUpdateEmailClick}>
                        Update Email
                      </button>
                    </div>
                  </div>

                  <hr className="profile-security-divider" />

                  {/* Change Password */}
                  <div className="profile-info-grid" style={{ marginTop: "1.25rem" }}>
                    <div className="profile-info-item">
                      <label className="profile-info-label">CURRENT PASSWORD</label>
                      <input
                        className="profile-security-input"
                        type="password"
                        maxLength={16}
                        value={password.old_password}
                        onChange={(e) => setPassword((p) => ({ ...p, old_password: e.target.value }))}
                      />
                    </div>
                    <div className="profile-info-item">
                      <label className="profile-info-label">NEW PASSWORD</label>
                      <input
                        className="profile-security-input"
                        type="password"
                        maxLength={16}
                        value={password.new_password}
                        onChange={(e) => setPassword((p) => ({ ...p, new_password: e.target.value }))}
                      />
                    </div>
                    <div className="profile-info-item full-width">
                      <label className="profile-info-label">CONFIRM NEW PASSWORD</label>
                      <input
                        className="profile-security-input"
                        type="password"
                        maxLength={16}
                        value={password.confirm}
                        onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                      />
                    </div>
                    <div className="profile-info-item full-width">
                      <button className="profile-security-btn-primary" onClick={handleChangePasswordClick}>
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}