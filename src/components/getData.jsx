import { auth, DB, storage } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";

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
  const [progress, setProgress] = useState(0);

  console.log(moviesList);

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

  // Fetch Data From Firebase
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
  }, []);

  const onSubmitMovie = () => {
    // Get a reference to the image file and upload it to Firebase Storage
    const file = fileUpload;
    const storageRef = ref(storage, `PostersMovies/${fileUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Handle upload progress or errors
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        // Handle error
      },
      async () => {
        // Handle successful upload
        // Get the URL of the uploaded image
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        // Push a document to Firestore with the URL of the image
        try {
          const docRef = await setDoc(doc(DB, "movies", `${Date.now()}`), {
            name: movieName,
            releaseDate: movieReleaseDate,
            director: movieDirector,
            winOscar: movieWinOscar,
            date: Date.now(),
            creatorId: auth?.currentUser?.uid,
            imgUrl: url,
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
        getMoviesList();
        setProgress(0);
      }
    );
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(DB, "movies", id);
    await deleteDoc(movieDoc);
    getMoviesList();
  };

  const updateMovie = async (id) => {
    const movieDoc = doc(DB, "movies", id);
    await updateDoc(movieDoc, {
      name: updatedMovieName,
      date: Date.now(),
    });
    getMoviesList();
  };

  const uploadFile = async () => {};

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
            onChange={(e) => Number(setMovieReleaseDate(e.target.value))}
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
            Win Oscar?
          </label>
        </div>
        <div class="input-group mb-3">
          <label class="input-group-text" for="file_upload">
            Poster
          </label>
          <input
            type="file"
            class="form-control"
            id="file_upload"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
        </div>
      </form>
      <div
        className="progress"
        role="progressbar"
        aria-label="Info example"
        aria-valuenow={`${progress}`}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar bg-info text-dark"
          style={{ width: `${progress}%` }}
        >
          {progress}
        </div>
      </div>
      <button onClick={onSubmitMovie} class="btn mt-2 btn-success">
        Submit
      </button>
      <hr />
      {moviesList.map((movie) => (
        <div
          style={{ backgroundColor: "#f1f1f1" }}
          className="card mb-4 p-2"
          key={movie.id}
        >
          <img src={movie.imgUrl} />
          <h1 className="mt-2">{movie.name}</h1>
          <h4>The Director > {movie.director}</h4>

          <h2>{movie.releaseDate}</h2>
          <h3 className="mb-0">
            Win Oscar ? >{" "}
            <span style={{ color: movie.winOscar ? "green" : "gray" }}>
              {movie.winOscar ? "Yes" : "No"}
            </span>
          </h3>
          <hr />
          <h5>
            Posted before{" "}
            {formatDistance(movie.date, Date.now(), {
              includeSeconds: true,
            })}
          </h5>
          <hr />
          <span>id: {movie.id}</span>
          <hr />
          <div class="mb-3">
            <label for="updateName" class="form-label">
              Update Name [ only creator ]
            </label>
            <input
              type="text"
              class="form-control"
              id="updateName"
              onChange={(e) => setUpdatedMovieName(e.target.value)}
            />
          </div>
          <hr />
          <button
            className="btn btn-danger"
            onClick={() => deleteMovie(movie.id)}
          >
            Delete Movie [ only creator ]
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

/*
   // Handle upload progress or errors
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle upload progress
        console.log(snapshot);
      },
      (error) => {
        // Handle error
      },
      async () => {
        // Handle successful upload
        // Get the URL of the uploaded image
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        // Push a document to Firestore with the URL of the image
        try {
           setDoc(doc(DB, "movies", `${Date.now()}`), {
        name: movieName,
        releaseDate: movieReleaseDate,
        director: movieDirector,
        winOscar: movieWinOscar,
        date: Date.now(),
        creatorId: auth?.currentUser?.uid
        )}
*/
