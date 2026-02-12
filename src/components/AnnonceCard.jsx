import React from 'react';

function AnnonceCard({ annonce }) {
  return (
    <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
      <img 
        // On utilise l'URL Google Image enregistrée, ou une image par défaut
        src={annonce.imageUrl || "https://via.placeholder.com/300x200?text=Pas+de+photo"} 
        alt={annonce.titre}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div style={{ padding: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{annonce.titre}</h3>
        <p style={{ color: '#E8553A', fontWeight: 'bold', fontSize: '18px' }}>{annonce.prix} €</p>
        <p style={{ color: '#666', fontSize: '14px' }}>📍 {annonce.ville}</p>
      </div>
    </div>
  );
}

export default AnnonceCard;