import React, { useState, useEffect } from 'react';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    bio: string;
}

const ProfileModificationPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simuler une requête API pour récupérer les données utilisateur
        fetch('/api/user/profile')
            .then((response) => response.json())
            .then((data) => {
                setProfile(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Erreur lors du chargement du profil.');
                setIsLoading(false);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (profile) {
            setProfile({
                ...profile,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simuler une requête API pour mettre à jour les données utilisateur
        fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour du profil.');
                }
                alert('Profil mis à jour avec succès !');
            })
            .catch((err) => {
                setError('Erreur lors de la mise à jour du profil.');
            });
    };

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Modifier le profil</h1>
            {profile && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Nom :</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="bio">Bio :</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Enregistrer</button>
                </form>
            )}
        </div>
    );
};

export default ProfileModificationPage;