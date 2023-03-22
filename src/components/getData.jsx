import { auth, DB, storage } from "../config/firebase";
import {
    getDocs,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GetData = () => {
    const [moviesList, setMoviesList] = useState([]);
    const moviesListCollection = collection(DB, "movies");

    // States For New movie
    const [movieName, setMovieName] = useState("");
    const [movieReleaseDate, setMovieReleaseDate] = useState(0);
    const [movieDirector, setMovieDirector] = useState("");
    const [movieWinOscar, setMovieWinOscar] = useState(false);

    // Update States
    const [updatedMovieName, setUpdatedMovieName] = useState("");

    // File Upload State
    const [fileUpload, setFileUpload] = useState(null);

    // Logout Function
    const logout = async () => {
        // Create New User
        try {
            await signOut(auth);
            // document.location.href = "/";
        } catch (err) {
            console.error(err);
        }
    };
    const getMoviesList = async () => {
        try {
            const data = await getDocs(moviesListCollection);
            const falteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setMoviesList(falteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getMoviesList();
    }, [moviesList]);

    const onSubmitMovie = async () => {
        try {
            await addDoc(moviesListCollection, {
                name: movieName,
                releaseDate: movieReleaseDate,
                director: movieDirector,
                winOscar: movieWinOscar,
                creatorId: auth?.currentUser?.uid,
            });
            uploadFile();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMovie = async (id) => {
        const movieDoc = doc(DB, "movies", id);
        await deleteDoc(movieDoc);
    };

    const updateMovie = async (id) => {
        const movieDoc = doc(DB, "movies", id);
        await updateDoc(movieDoc, {
            name: updatedMovieName,
        });
    };

    const uploadFile = async () => {
        if (!fileUpload) return;
        const projectFilesRef = ref(
            storage,
            `/projectFiles/images/${fileUpload.name}`
        );
        try {
            await uploadBytes(projectFilesRef, fileUpload);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Link to="/">
                <button className="btn btn-danger mt-3" onClick={logout}>
                    Logout
                </button>
            </Link>
            <form className="mt-3">
                <div class="mb-3">
                    <label for="movie_name" class="form-label">
                        Movie Name
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="movie_name"
                        aria-describedby="movie_name_help"
                        onChange={(e) => setMovieName(e.target.value)}
                    />
                    <div id="movie_name_help" class="form-text">
                        Enter The Movie Name
                    </div>
                </div>
                <div class="mb-3">
                    <label for="releaseDate" class="form-label">
                        Release Date
                    </label>
                    <input
                        type="number"
                        class="form-control"
                        id="releaseDate"
                        onChange={(e) =>
                            Number(setMovieReleaseDate(e.target.value))
                        }
                    />
                </div>
                <div class="mb-3">
                    <label for="director" class="form-label">
                        Name of Director
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="director"
                        onChange={(e) => setMovieDirector(e.target.value)}
                    />
                </div>
                <div class="mb-3 form-check">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        id="winOscar"
                        checked={movieWinOscar}
                        onChange={(e) => setMovieWinOscar(e.target.checked)}
                    />
                    <label class="form-check-label" for="winOscar">
                        Who Win Oscar?
                    </label>
                </div>
                <div class="input-group mb-3">
                    <label class="input-group-text" for="file_upload">
                        Upload Photo
                    </label>
                    <input
                        type="file"
                        class="form-control"
                        id="file_upload"
                        onChange={(e) => setFileUpload(e.target.files[0])}
                    />
                </div>
            </form>
            <button onClick={onSubmitMovie} class="btn btn-success">
                Submit
            </button>
            <hr />
            {moviesList.map((movie) => (
                <div className="card mt-2 p-2" key={movie.id}>
                    <h1>{movie.name}</h1>
                    <h4>The Director > {movie.director}</h4>

                    <h2>{movie.releaseDate}</h2>
                    <h3 className="mb-0">
                        Who Win Oscar ? >{" "}
                        <span
                            style={{ color: movie.winOscar ? "green" : "gray" }}
                        >
                            {movie.winOscar ? "Yes" : "No"}
                        </span>
                    </h3>
                    <hr />
                    <div class="mb-3">
                        <label for="updateName" class="form-label">
                            Update Name
                        </label>
                        <input
                            type="text"
                            class="form-control"
                            id="updateName"
                            onChange={(e) =>
                                setUpdatedMovieName(e.target.value)
                            }
                        />
                    </div>
                    <hr />
                    <button
                        className="btn btn-danger"
                        onClick={() => deleteMovie(movie.id)}
                    >
                        Delete Movie
                    </button>
                    <button
                        className="btn btn-primary mt-1"
                        onClick={() => updateMovie(movie.id)}
                    >
                        Update Movie
                    </button>
                </div>
            ))}
        </>
    );
};

export { GetData };
