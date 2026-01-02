import { createContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
} from "firebase/auth";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    // Email signup
    const signUpEmail = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Email login
    const signInEmail = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Google sign in / sign up
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth)
            .then(() => {
                // Clear localStorage if needed
                localStorage.removeItem("user"); // Optionally clear localStorage
                setUser(null); // Ensure user state is reset
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message); // Handle error if any
                setLoading(false);
            });
    };

    // Auth state observer
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            if(currentUser){
                const userInfo = {email: currentUser.email}
                axiosPublic.post('/api/jwt', userInfo)
                .then(res => {
                    if(res.data.token){
                        localStorage.setItem("access-token", res.data.token)
                    }
                })
            } 
            else{
                localStorage.removeItem('access-token')
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        signUpEmail,
        signInEmail,
        signInWithGoogle,
        logOut,
        error,
        setError,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
