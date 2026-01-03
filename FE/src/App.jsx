import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ClassDetail from './pages/ClassDetail';
import VocabularySet from './pages/VocabularySet';
import Practice from './pages/Practice';
import Leaderboard from './pages/Leaderboard';
import AuthCallback from './pages/AuthCallback';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Home />} />
                <Route path="class/:classId" element={<ClassDetail />} />
                <Route path="set/:setId" element={<VocabularySet />} />
                <Route path="practice/:setId" element={<Practice />} />
                <Route path="leaderboard" element={<Leaderboard />} />
            </Route>
        </Routes>
    );
}

export default App;
