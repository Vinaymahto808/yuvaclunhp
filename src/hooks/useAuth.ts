import { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Make sure to import your Firebase authentication instance

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        return await auth.signInWithEmailAndPassword(email, password);
    };

    const signOut = async () => {
        return await auth.signOut();
    };

    return { user, loading, signIn, signOut };
};

export default useAuth;