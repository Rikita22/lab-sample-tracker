import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Header from "./components/Header";
import SampleForm from "./components/SampleForm";
import SampleList from "./components/SampleList";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import {useSelector} from "react-redux";


function App() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    return (
        <Router>
            {isAuthenticated && <Header />}
            <Routes>
                <Route path="/home" element={<HomePage/>} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/create" element={<SampleForm />} />
                <Route path="/list" element={<SampleList />} />
                <Route path="*" element={<Navigate to="/"/>} />
            </Routes>
        </Router>
    );
}

export default App;