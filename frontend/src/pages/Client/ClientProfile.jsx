import { useState, useEffect, useCallback, useRef } from 'react';
import '../../components/clientCss/ClientProfile.css';
import DefaultProfilePic from '../../assets/img/Profile.webp';
import AxiosInstance from '../../components/AxiosInstance';

function ClientProfile() {
  const [selectedImage, setSelectedImage] = useState(DefaultProfilePic);
  const [serverImageId, setServerImageId] = useState(null);
  const blobUrlRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: { street: "", city: "", province: "", postal_code: "" }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fileError, setFileError] = useState('');
  const [fileSize, setFileSize] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // ✅ Load image as blob with authentication
  const loadImageFromServer = useCallback(async () => {
    try {
      const response = await AxiosInstance.get("core/user-image/");
      const images = response.data.results ?? response.data;
      if (images && images.length > 0) {
        const img = images[0];
        setServerImageId(img.id);
        const imageUrl = `${img.url}?t=${Date.now()}`;
        const blobRes = await AxiosInstance.get(imageUrl, { responseType: 'blob' });
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const newBlobUrl = URL.createObjectURL(blobRes.data);
        blobUrlRef.current = newBlobUrl;
        setSelectedImage(newBlobUrl);
      } else {
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
        setServerImageId(null);
        setSelectedImage(DefaultProfilePic);
      }
    } catch (err) {
      console.error("Error loading image:", err);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
      setSelectedImage(DefaultProfilePic);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
    loadImageFromServer();
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [loadImageFromServer]);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("core/customers/me/");
      const customer = response.data || {};
      const address = customer.address || {};
      setUserInfo({
        email: customer?.email || "",
        first_name: customer?.firstname || "",
        last_name: customer?.lastname || "",
        phone: customer?.phonenumber || "",
        address: {
          street: address?.street || "",
          city: address?.city || "",
          province: address?.province || "",
          postal_code: address?.postalcode || "",
        },
      });
    } catch (err) {
      console.error("Error fetching user info:", err);
      setMessage({ type: "error", text: "Failed to load user information." });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadUserImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  try {
    if (serverImageId) {
      await AxiosInstance.post(`core/user-image/${serverImageId}/replace/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await AxiosInstance.post("core/user-image/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    await loadImageFromServer(); // refresh
    window.dispatchEvent(new CustomEvent("profileImageUpdated"));
    setMessage({ type: "success", text: "Profile image saved!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  } catch (err) {
    console.error("Upload error:", err.response?.status, err.response?.data);
    setMessage({ type: "error", text: "Failed to upload image. Please try again." });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }
};

  const deleteUserImage = async () => {
    if (!serverImageId) return;
    try {
      await AxiosInstance.delete(`core/user-image/${serverImageId}/`);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
      setServerImageId(null);
      setSelectedImage(DefaultProfilePic);
      window.dispatchEvent(new CustomEvent("profileImageUpdated"));
      setMessage({ type: "success", text: "Profile picture removed!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage({ type: "error", text: "Failed to remove image." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File too large! Max ${formatFileSize(MAX_FILE_SIZE)}. Your file: ${formatFileSize(file.size)}`);
        setFileSize(file.size);
        return;
      }
      setFileError('');
      setFileSize(file.size);
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setFileError('Error reading file.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (isUploading || fileError) return;
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      uploadUserImage(file);
      fileInput.value = '';
    } else {
      setMessage({ type: "error", text: "No file selected." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm('Remove profile picture?')) deleteUserImage();
  };

  const isDefaultImage = () => selectedImage === DefaultProfilePic;
  const hasImageChanged = () => {
    if (selectedImage.startsWith('data:image')) return true;
    return selectedImage !== DefaultProfilePic;
  };

  const handleImageError = () => {
    console.warn("Image failed to load, falling back to default");
    setSelectedImage(DefaultProfilePic);
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-title">PROFILE</div>
        <div className="profile-container">
          <div className="profile-card loading-card"><p>Loading...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="profile-title">PROFILE</div>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-card">
            {message.text && (
              <div className={`message-alert ${message.type}`}>
                <span>{message.text}</span>
                <button className="close-alert" onClick={() => setMessage({ type: "", text: "" })}>×</button>
              </div>
            )}

            <div className="profile-layout">
              <div className="profile-image-column">
                <div className="profile-image-section">
                  <div className="profile-image-wrapper">
                    <img
                      key={selectedImage}
                      src={selectedImage}
                      alt="Profile"
                      className="profile-avatar"
                      onError={handleImageError}
                    />
                  </div>

                  {fileSize && !fileError && (
                    <div className="profile-file-info">
                      <span>File size: {formatFileSize(fileSize)}</span>
                    </div>
                  )}
                  {fileError && <div className="profile-error"><span>{fileError}</span></div>}
                  {isUploading && (
                    <div className="profile-upload-progress">
                      <p>Uploading...</p>
                      <div className="progress-bar"><div className="progress-fill"></div></div>
                    </div>
                  )}

                  <div className="profile-image-actions">
                    <label className={`profile-choose-btn ${isUploading ? 'disabled' : ''}`}>
                      CHOOSE IMAGE
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} style={{ display: 'none' }} />
                    </label>
                    {!isDefaultImage() && (
                      <button className={`profile-remove-btn ${isUploading ? 'disabled' : ''}`} onClick={handleRemoveImage} disabled={isUploading}>
                        REMOVE
                      </button>
                    )}
                  </div>

                  {hasImageChanged() && (
                    <button className={`profile-save-image-btn ${isUploading || fileError ? 'disabled' : ''}`} onClick={handleSaveImage} disabled={isUploading || fileError}>
                      SAVE IMAGE
                    </button>
                  )}

                  <div className="profile-size-note">Max size: 5MB. Formats: JPG, PNG, WEBP</div>
                </div>
              </div>

              <div className="profile-info-column">
                <div className="profile-info-section">
                  <h2 className="profile-info-title">PERSONAL INFORMATION</h2>
                  <div className="profile-info-grid">
                    <div className="profile-info-item"><span className="profile-info-label">EMAIL</span><span className="profile-info-value">{userInfo.email || "—"}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">PHONE NUMBER</span><span className="profile-info-value">{userInfo.phone || "—"}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">FIRST NAME</span><span className="profile-info-value">{userInfo.first_name || "—"}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">LAST NAME</span><span className="profile-info-value">{userInfo.last_name || "—"}</span></div>
                    <div className="profile-info-item full-width"><span className="profile-info-label">STREET ADDRESS</span><span className="profile-info-value">{userInfo.address.street || "—"}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">CITY</span><span className="profile-info-value">{userInfo.address.city || "—"}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">PROVINCE</span><span className="profile-info-value">{userInfo.address.province || "—"}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">POSTAL CODE</span><span className="profile-info-value">{userInfo.address.postal_code || "—"}</span></div>
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

export default ClientProfile;