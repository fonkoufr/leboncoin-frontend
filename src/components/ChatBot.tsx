import { useState, useRef, useEffect, FC, FormEvent, ChangeEvent } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  spotifyId?: string | null;
}

interface AIResponse {
  text: string;
  spotifyId: string | null;
}

const styles = {
  chatButton: {
    position: 'fixed' as const, bottom: '20px', right: '20px',
    background: '#E8553A', color: 'white', border: 'none',
    borderRadius: '50%', width: '60px', height: '60px',
    fontSize: '30px', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 9999,
    transition: 'transform 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  chatWindow: {
    position: 'fixed' as const, bottom: '90px', right: '20px',
    width: '350px', height: '500px', background: 'white',
    borderRadius: '16px', boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column' as const, zIndex: 9999,
    overflow: 'hidden', border: '1px solid #f0f0f0',
    fontFamily: "'DM Sans', sans-serif"
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
    color: 'white', padding: '16px', fontWeight: 'bold',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  messagesArea: {
    flex: 1, padding: '15px', overflowY: 'auto' as const,
    background: '#FAFAF8', display: 'flex', flexDirection: 'column' as const, gap: '12px'
  },
  inputArea: {
    borderTop: '1px solid #eee', padding: '12px', display: 'flex', gap: '10px', background: '#fff'
  },
  input: {
    flex: 1, padding: '12px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '14px'
  },
  sendBtn: {
    border: 'none', background: '#E8553A', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  msgUser: {
    alignSelf: 'flex-end', background: '#E8553A', color: 'white', padding: '10px 15px', borderRadius: '18px 18px 0 18px', maxWidth: '85%', fontSize: '14px', boxShadow: '0 2px 5px rgba(232,85,58,0.2)'
  },
  msgBot: {
    alignSelf: 'flex-start', background: 'white', color: '#333', padding: '10px 15px', borderRadius: '18px 18px 18px 0', maxWidth: '85%', fontSize: '14px', border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  spotifyContainer: {
    marginTop: '10px', borderRadius: '12px', overflow: 'hidden' as const, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  typing: {
    fontSize: '12px', color: '#888', fontStyle: 'italic', marginLeft: '10px', marginBottom: '5px'
  }
};

const ChatBot: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Bonjour ! 👋 Je suis l\'IA de Fonky\'s. Dites-moi ce que vous cherchez (vélo, maison...) ou demandez de la musique ! 🎵' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateAI = (text: string): AIResponse => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('musique') || lowerText.includes('spotify') || lowerText.includes('chanson')) {
      return { 
        text: "Avec plaisir ! Voici une playlist 'Vibes Shopping' spécialement sélectionnée pour vous. 🎧", 
        spotifyId: "37i9dQZF1DXcBWIGoYBM5M"
      };
    }
    
    if (lowerText.includes('vélo') || lowerText.includes('sport') || lowerText.includes('vtt')) {
      return { 
        text: "Excellent choix ! Pour vos sorties sportives, voici un peu de Rock pour vous motiver ! 🚴‍♂️🔥", 
        spotifyId: "37i9dQZF1DWXRqgorJj26U"
      };
    }

    if (lowerText.includes('maison') || lowerText.includes('meuble') || lowerText.includes('canapé')) {
      return { 
        text: "Pour décorer votre intérieur, rien de mieux qu'une ambiance Jazz Lo-Fi relaxante. 🎷🛋️", 
        spotifyId: "37i9dQZF1DWVqfgj8N3E8H"
      };
    }

    if (lowerText.includes('voiture') || lowerText.includes('auto')) {
      return { 
        text: "En route ! Voici les meilleurs titres pour conduire (Drive & Vibe). 🚗💨", 
        spotifyId: "37i9dQZF1DX4o1oenSJRJd"
      };
    }

    return { 
      text: "Je vois ! Je peux vous aider à trouver des articles ou mettre de l'ambiance. Essayez de taper 'Musique' ou 'Vélo' pour voir ma magie opérer ! ✨", 
      spotifyId: null 
    };
  };

  const handleSend = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = simulateAI(userText);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response.text, 
        spotifyId: response.spotifyId 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <button style={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>Fonky's AI Assistant ✨</span>
            <span style={{fontSize:'12px', opacity:0.8}}>En ligne</span>
          </div>
          
          <div style={styles.messagesArea}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.sender === 'user' ? styles.msgUser : styles.msgBot}>
                <div>{msg.text}</div>
                {msg.spotifyId && (
                  <div style={styles.spotifyContainer}>
                    <iframe 
                      src={`https://open.spotify.com/embed/playlist/${msg.spotifyId}?utm_source=generator&theme=0`} 
                      width="100%" 
                      height="80" 
                      frameBorder={0}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
            ))}
            {isTyping && <div style={styles.typing}>Fonky's AI écrit...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form style={styles.inputArea} onSubmit={handleSend}>
            <input 
              style={styles.input} 
              placeholder="Parlez-moi... (ex: 'Je veux de la musique')" 
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" style={styles.sendBtn}>➤</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
