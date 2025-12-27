
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import PropertyForm from './pages/PropertyForm';
import OwnerForm from './pages/OwnerForm';
import NotificationsPage from './pages/NotificationsPage';
import Schedule from './pages/Schedule';
import ProfileMain from './pages/ProfileMain';
import ProfileInfo from './pages/ProfileInfo';
import SystemSettings from './pages/SystemSettings';
import ProPlan from './pages/ProPlan';
import LoadingScreen from './components/LoadingScreen';
import Login from './pages/Login';
import { auth, getUserData } from './services/FirebaseService';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const data = await getUserData(firebaseUser.uid);
        setUser(data);
      } else {
        setUser(null);
      }
      setLoading(false);
      
      setTimeout(() => {
        setAppReady(true);
        window.dispatchEvent(new Event('app-ready'));
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !appReady) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/properties" element={<PropertyList user={user} />} />
            <Route path="/property/:id" element={<PropertyDetail user={user} />} />
            <Route path="/property/new" element={<PropertyForm user={user} />} />
            <Route path="/property/edit/:id" element={<PropertyForm user={user} />} />
            <Route path="/owner/new" element={<OwnerForm user={user} />} />
            <Route path="/schedule" element={<Schedule user={user} />} />
            <Route path="/notifications" element={<NotificationsPage user={user} />} />
            <Route path="/profile" element={<ProfileMain user={user} />} />
            <Route path="/profile/info" element={<ProfileInfo user={user} />} />
            <Route path="/profile/settings" element={<SystemSettings user={user} />} />
            <Route path="/profile/pro" element={<ProPlan user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

export default App;
