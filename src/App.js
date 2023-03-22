import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Auth } from "./components/auth";
import { GetData } from "./components/getData";
import {
    createBrowserRouter,
    RouterProvider,
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";

function App() {
    /*
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Auth />,
        },
        {
            path: "/movies",
            element: <GetData />,
        },
        {<RouterProvider router={router} />}
    ]);
    */

    return (
        <div className="container">
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Auth />} />
                        <Route path="/movies" element={<GetData />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
