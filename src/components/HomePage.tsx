import { useEffect, useState } from "react";

interface Koncert {
    id: number;
    felleponev: string;
    kezdesido: Date;
    idotartam: number;
    elmarad: boolean;
}

export default function HomePage() {
    const [koncertek, setKoncertek] = useState<Koncert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errorServer, setErrorServer] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/kavezo")
            .then((response) => {
                if (response.status === 404) {
                    setErrorServer('A kért erőforrás nem található (404)!');
                    return;
                }
                if (!response.ok) {
                    setErrorServer(`A szerver a következő státusszal válaszolt: ${response.status}`);
                    return;
                }
                return response.json();
            })
            .then((data) => {
                setKoncertek(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    const handleElmarad = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/kavezo/${id}/elmarad`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setKoncertek(prevKoncertek =>
                    prevKoncertek.map(koncert =>
                        koncert.id === id ? { ...koncert, elmarad: true } : koncert
                    )
                );
            } else {
                console.error("Nem sikerült a koncert frissítése.");
            }
        } catch (error) {
            console.error("Hiba történt a koncert állapotának frissítésekor:", error);
        }
    };

    if (errorServer) {
        return <p>{errorServer}</p>;
    }

    if (loading) {
        return <p>Betöltés...</p>;
    }

    if (error) {
        return <p>Hiba történt: {error}</p>;
    }

    return (
        <>
            <h1>Koncertek</h1>
            <h3>Adj hozzá egy új koncertet:</h3>
            <a href="UjKoncert" className="btn btn-primary btn-lg active" role="button" aria-pressed="true">Új koncert hozzáadása</a>
            <h2>Koncertek listája</h2>
            <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Fellépő neve</th>
                        <th className="border px-4 py-2">Kezdés időpontja</th>
                        <th className="border px-4 py-2">Időtartam</th>
                        <th className="border px-4 py-2">Elmarad</th>
                    </tr>
                </thead>
                <tbody>
                    {koncertek.length > 0 ? (
                        koncertek.map(koncert => (
                            <tr key={koncert.id} className={koncert.elmarad ? "bg-gray-300" : ""}>
                                <td className="border px-4 py-2">{koncert.felleponev}</td>
                                <td className="border px-4 py-2">{new Date(koncert.kezdesido).toLocaleString()}</td>
                                <td className="border px-4 py-2">{koncert.idotartam} perc</td>
                                <td className="border px-4 py-2">
                                    {koncert.elmarad ? (
                                        "Igen"
                                    ) : (
                                        <button
                                            className="bg-red-500 text-white py-1 px-3 rounded"
                                            onClick={() => handleElmarad(koncert.id)}
                                        >
                                            Jelölés elmaradásként
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="border px-4 py-2" colSpan={4}>Nincsenek koncertek.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
