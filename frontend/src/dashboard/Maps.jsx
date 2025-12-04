import { useState } from "react";
import "../App.css";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

function Maps() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div
        className="mapsWrapper clickable"
        onClick={() => setShowMap(true)}
      >
        <AddLocationAltIcon
          style={{
            fontSize: 40,
            color: "#06632b",
            marginTop: "30px",
          }}
        />
      </div>

      {showMap && (
        <div className="overlayMap">
          <div className="overlayMapContent">
            <h3 style={{ marginBottom: "10px" }}>Google Maps</h3>

            <iframe
              title="google-map"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "10px" }}
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345092623!2d144.95373531550424!3d-37.81627937975151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577cdb0a6b7e3d!2sGoogle!5e0!3m2!1sen!2sca!4v1706630300000"
            ></iframe>

            <button
              className="closeMapBtn"
              onClick={() => setShowMap(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Maps;
