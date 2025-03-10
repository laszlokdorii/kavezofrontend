import { useState } from "react";

export default function Koncertfelvétel() {
    const [felleponev, setFelleponev] = useState<string>("");
    const [kezdesido, setKezdesido] = useState<string>("");
    const [idotartam, setIdotartam] = useState<number>();
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const UjKoncert = {
            felleponev,
            kezdesido,
            idotartam
        };

        try {
            const response = await fetch('http://localhost:3000/kavezo', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UjKoncert),
            });

            if (!response.ok) {
                throw new Error(`Szerverhiba: ${response.status}`);
            }

            setSuccess(true);
            setFelleponev('');
            setKezdesido('');
            setIdotartam(0);

        } catch (err : any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <a href="HomePage" className="btn btn-primary btn-lg active" role="button" aria-pressed="true">Vissza a koncertek listájához</a>

            <h1>Új Koncert Felvétele</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Fellépő név:</label>
                    <input 
                        type="text" 
                        value={felleponev}
                        onChange={(e) => setFelleponev(e.target.value)}
                    />
                </div>
                <div>
                    <label>Kezdés időpontja:</label>
                    <input 
                        type="datetime-local"
                        value={kezdesido}
                        onChange={(e) => setKezdesido(e.target.value)}
                    />
                </div>
                <div>
                    <label>Időtartam (perc):</label>
                    <input 
                        type="number" 
                        value={idotartam}
                        onChange={(e) => setIdotartam(Number(e.target.value))}
                    />
                </div>
                <button type="submit">Koncert Felvétele</button>
            </form>
            
            {success && <p style={{ color: 'green' }}>A koncert sikeresen hozzáadva!</p>}
            {error && <p style={{ color: 'red' }}>Hiba történt: {error}</p>}
        </div>
    );
}