// IMPORT
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Auth = () => {
    // useStates
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email);

    // Sign in Function
    const signIn = async () => {
        // Create New User
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // document.location.href = "/movies";
        } catch (err) {
            console.error(err);
        }
    };

    // Sign in With GOOGLE
    const signInWithGoogle = async () => {
        // Create New User
        try {
            await signInWithPopup(auth, googleProvider);
            // document.location.href = "/movies";
        } catch (err) {
            console.error(err);
        }
    };

    // Render Component
    return (
        <div>
            <div>
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div id="emailHelp" class="form-text">
                            We'll never share your email with anyone else.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            class="form-control"
                            id="exampleInputPassword1"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <Link to="/movies">
                <button onClick={signIn} type="submit" class="btn btn-primary">
                    Login in
                </button>
            </Link>
            <Link to="/movies">
                <button
                    className="btn btn-success m-1"
                    onClick={signInWithGoogle}
                >
                    SIGN IN GOOGLE
                </button>
            </Link>
        </div>
    );
};
