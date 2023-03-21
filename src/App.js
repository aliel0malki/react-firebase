import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Auth } from "./components/auth";
import { GetData } from "./components/getData";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Auth />,
        },
        {
            path: "/movies",
            element: <GetData />,
        },
    ]);

    return (
        <div className="container">
            <div className="App">{<RouterProvider router={router} />}</div>
        </div>
    );
}

export default App;
