import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnnonceById } from '../services/api';

function AnnonceDetailPage() {
    const { id } = useParams();
    const [annonce, setAnnonce] = useState(null);

    useEffect(() => {
        getAnnonceById(id).then(data => setAnnonce(data));
    }, [id]);

    if (!annonce) return <div className="container">Chargement...</div>;

    return (
        <div className="container" style={{marginTop: '20px'}}>
            <Link to="/" style={{textDecoration:'none', color:'#666'}}>← Retour aux annonces</Link>
            
            <div className="card" style={{marginTop: '20px', padding: '20px'}}>
                
                {/* 👇 AFFICHAGE DE L'IMAGE EN GRAND */}
                {annonce.imageUrl ? (
                    <img src={annonce.imageUrl} alt={annonce.titre} style={{width:'100%', maxHeight:'400px', objectFit:'contain', borderRadius:'8px', marginBottom:'20px'}} />
                ) : (
                    <div className="card-image-placeholder" style={{height: '300px'}}>📷 Pas de photo</div>
                )}

                <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>{annonce.titre}</h1>
                <p style={{color: '#ff6e14', fontSize: '1.5rem', fontWeight: 'bold'}}>{annonce.prix} €</p>
                <hr style={{border: '1px solid #eee', margin: '20px 0'}} />
                <h3>Description</h3>
                <p style={{lineHeight: '1.6'}}>{annonce.description}</p>
                
                <button className="btn-orange" style={{width: '100%', marginTop: '30px'}}>
                    Acheter
                </button>
            </div>
        </div>
    );
}

export default AnnonceDetailPage;