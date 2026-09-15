import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import PublicPassport from './pages/PublicPassport';

import KvicLogin from './pages/kvic/KvicLogin';
import KvicRegister from './pages/kvic/KvicRegister';
import KvicDashboard from './pages/kvic/KvicDashboard';
import KvicFarms from './pages/kvic/KvicFarms';
import KvicBatches from './pages/kvic/KvicBatches';



import {
  isKvicAuthenticated,
} from './services/kvicAuthService';


/* ============================================================
   BEEKEEPER PROTECTED ROUTE
============================================================ */

function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem(
      'honeychain_token'
    );

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


/* ============================================================
   KVIC PROTECTED ROUTE
============================================================ */

function KvicProtectedRoute({ children }) {
  if (!isKvicAuthenticated()) {
    return (
      <Navigate
        to="/kvic/login"
        replace
      />
    );
  }

  return children;
}


/* ============================================================
   APP
============================================================ */

function App() {
  return (
    <ThemeProvider>

      <BrowserRouter>

        <Routes>

          {/* ==================================================
              NORMAL HONEYCHAIN APPLICATION
          ================================================== */}

          <Route
            path="/"
            element={<Layout />}
          >

            {/* HOME */}
            <Route
              index
              element={<Home />}
            />


            {/* ABOUT */}
            <Route
              path="about"
              element={<About />}
            />


            {/* BEEKEEPER LOGIN */}
            <Route
              path="login"
              element={<Login />}
            />


            {/* BEEKEEPER REGISTER */}
            <Route
              path="register"
              element={<Register />}
            />


            {/* BEEKEEPER DASHBOARD */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            {/* PUBLIC PASSPORT */}
            <Route
              path="passport/:batchId"
              element={<PublicPassport />}
            />

          </Route>


          {/* ==================================================
              KVIC ADMIN AUTHENTICATION
          ================================================== */}

          <Route
            path="/kvic/login"
            element={<KvicLogin />}
          />


          <Route
            path="/kvic/register"
            element={<KvicRegister />}
          />


          {/* ==================================================
              KVIC ADMIN DASHBOARD
              
              We'll create KvicDashboard in the next step.
          ================================================== */}

          
          <Route
            path="/kvic/dashboard"
            element={
              <KvicProtectedRoute>
                <KvicDashboard />
              </KvicProtectedRoute>
            }
          />

          <Route
            path="/kvic/farms"
            element={
              <KvicProtectedRoute>
                <KvicFarms />
              </KvicProtectedRoute>
            }
          />

          <Route
  path="/kvic/batches"
  element={
    <KvicProtectedRoute>
      <KvicBatches />
    </KvicProtectedRoute>
  }
/>
          


          {/* ==================================================
              UNKNOWN ROUTE
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App;