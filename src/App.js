import React, { useState } from 'react';
import './App.css';
import Webcam from 'react-webcam';
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import app from './firebase'
import Modal from 'react-modal';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState(false);

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleUpload = () => {
      console.log('Uploading...');
    if (name && consent && image) {

        const storage = getStorage();
        const imagePath = `images/${name}.jpg`;
        const storageRef = ref(storage, imagePath)

        uploadString(storageRef, image, "data_url").then((snapshot) => {
            console.log("Uploaded a data_url string!");
            setSuccess(true)
        });

        const storageRef2 = ref(storage, `consent/${name}.json`)
        uploadString(storageRef2, JSON.stringify({name, email, consent, imagePath})).then((snapshot) => {
            console.log("Uploaded a consent string!");
        });

    } else {
      alert('Please fill in all fields and take a picture.');
    }
  };

  return (
      <div className="container">
        <h1>Bless Up</h1>
          { image ? <img src={image} alt="Captured" /> :
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="webcam" />
          }
          <button onClick={capture} className="capture-button">Capture photo</button>
        {/*<div>*/}
        {/*  <img src={image} alt="Captured" />*/}
        {/*</div>*/}
        <div className="input-group">
          <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
          />
          <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
          />
        </div>
        <div className="input-group">
          <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
          />
          <label> I consent to receive a blessing</label>
        </div>
        <button onClick={handleUpload} className="upload-button">Upload</button>
          <Modal
              isOpen={success}
              onRequestClose={() => setSuccess(false)}
              contentLabel="Upload Successful"
              className="modal"
              overlayClassName="modal-overlay"
          >
              <h2>Upload Successful!</h2>
              <p>We will contact you when your blessing has been completed. Please reach out to bek@siddhamahayoga.com if you have any questions</p>
              <button onClick={() => setSuccess(false)} className="close-button">Close</button>
          </Modal>
      </div>
  );
};

export default App;
