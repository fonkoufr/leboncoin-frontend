const API_URL = "http://localhost:8080/api";

// ══════════════════════════════════════════════
// GESTION DES ANNONCES
// ══════════════════════════════════════════════

// 1. Récupérer toutes les annonces
export const getAnnonces = async () => {
    try {
        const response = await fetch(`${API_URL}/annonces`);
        if (!response.ok) throw new Error("Erreur réseau");
        return await response.json();
    } catch (error) {
        console.error("Erreur GET:", error);
        return []; // Retourne un tableau vide pour éviter de casser l'app
    }
};

// 2. Créer une annonce
export const createAnnonce = async (annonce) => {
    console.log("📤 Envoi annonce :", annonce);

    const response = await fetch(`${API_URL}/annonces`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(annonce),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur Serveur (${response.status}) : ${text}`);
    }

    return await response.json();
};

// 3. Récupérer une seule annonce par ID
export const getAnnonceById = async (id) => {
    const response = await fetch(`${API_URL}/annonces/${id}`);
    if (!response.ok) throw new Error("Annonce introuvable");
    return await response.json();
};

// 4. Supprimer une annonce
export const deleteAnnonce = async (id) => {
    await fetch(`${API_URL}/annonces/${id}`, { method: 'DELETE' });
};

// ══════════════════════════════════════════════
// GESTION DES UTILISATEURS (Auth)
// ══════════════════════════════════════════════

// 5. Inscription (Register)
export const registerUser = async (user) => {
    console.log("📤 Inscription :", user);
    
    // ⚠️ Note : On utilise "/utilisateurs/register" pour correspondre à ton Controller Java
    const response = await fetch(`${API_URL}/utilisateurs/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'inscription (Email déjà pris ?)");
    }
    return await response.json();
};

// 6. Connexion (Login) - C'EST LA FONCTION QUI MANQUAIT ! ✅
export const loginUser = async (credentials) => {
    console.log("🔑 Tentative de connexion :", credentials.email);

    // ⚠️ Note : On utilise "/utilisateurs/login"
    const response = await fetch(`${API_URL}/utilisateurs/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect");
    }
    
    // Le backend doit renvoyer l'utilisateur complet (id, nom, email...)
    const userData = await response.json();
    console.log("✅ Connecté :", userData);
    return userData;
};