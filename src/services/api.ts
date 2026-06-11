const API_URL = import.meta.env.VITE_API_URL as string;

export interface Annonce {
  id: string;
  titre: string;
  description: string;
  prix: number;
  ville: string;
  categorie?: string;
  imageUrl?: string;
  telephone?: string;
  email?: string;
  urgent?: boolean;
  datePublication?: string;
  userId?: number;
}

export interface User {
  id: number;
  nom: string;
  email: string;
  prenom?: string;
}

export interface UserCredentials {
  email: string;
  motDePasse: string;
}

export interface UserRegister extends UserCredentials {
  nom: string;
  prenom?: string;
}

export const getAnnonces = async (): Promise<Annonce[]> => {
  try {
    const response = await fetch(`${API_URL}/annonces`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des annonces");
    return await response.json();
  } catch (error) {
    console.error("Erreur GET Annonces:", error);
    return [];
  }
};

export const createAnnonce = async (annonce: Omit<Annonce, 'id'>): Promise<Annonce> => {
  const response = await fetch(`${API_URL}/annonces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(annonce),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erreur Serveur (${response.status}) : ${text}`);
  }
  return await response.json();
};

export const getAnnonceById = async (id: string): Promise<Annonce> => {
  const response = await fetch(`${API_URL}/annonces/${id}`);
  if (!response.ok) throw new Error("Annonce introuvable");
  return await response.json();
};

export const registerUser = async (user: UserRegister): Promise<User> => {
  const response = await fetch(`${API_URL}/utilisateurs/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Erreur lors de l'inscription");
  }
  return await response.json();
};

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
}

export const createPaymentIntent = async (req: PaymentIntentRequest): Promise<{ clientSecret: string }> => {
  const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) throw new Error('Erreur lors de la création du paiement');
  return response.json();
};

export const loginUser = async (credentials: UserCredentials): Promise<User> => {
  const response = await fetch(`${API_URL}/utilisateurs/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Email ou mot de passe incorrect");
  }

  return await response.json();
};
