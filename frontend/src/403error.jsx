import React from 'react';
import errorGif from './assets/403Error.gif'; 

const Error403 = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ERROR 403 Forbidden</h1>
      <p style={styles.message}>Acceso sin autorización</p>
      <div style={styles.imageContainer}>
        <img 
          src={errorGif} 
          alt="Recicladora" 
          style={styles.image}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f8f8'
  },
  title: {
    fontSize: '3rem',
    color: '#333'
  },
  message: {
    fontSize: '1.5rem',
    margin: '20px 0',
    color: '#666'
  },
  imageContainer: {
    width: '200px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  }
};

export default Error403;
