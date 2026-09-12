
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import PublicPassport from './pages/PublicPassport';


/*
 * ============================================================
 * PROTECTED ROUTE
 * ============================================================
 *
 * Checks whether the user has a HoneyChain login token.
 *
 * If token exists:
 *     → Allow access to dashboard
 *
 * If token does not exist:
 *     → Send user to Login page
 *
 * ============================================================
 */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('honeychain_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/*
 * ============================================================
 * APP
 * ============================================================
 */

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>

        <Routes>

          {/* ==================================================
              MAIN LAYOUT
          =================================================== */}

          <Route path="/" element={<Layout />}>

            {/* ==================================================
                HOME
            =================================================== */}

            <Route
              index
              element={<Home />}
            />


            {/* ==================================================
                ABOUT
            =================================================== */}

            <Route
              path="about"
              element={<About />}
            />


            {/* ==================================================
                LOGIN
            =================================================== */}

            <Route
              path="login"
              element={<Login />}
            />


            {/* ==================================================
                REGISTER
            =================================================== */}

            <Route
              path="register"
              element={<Register />}
            />


            {/* ==================================================
                DASHBOARD
            ==================================================
            
                Dashboard is protected.

                User must have:
                    honeychain_token

                Otherwise:
                    /login

            =================================================== */}

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Public QR passport — no login required */}
<Route path="passport/:batchId" element={<PublicPassport />} />


            {/* ==================================================
                UNKNOWN PAGE
            =================================================== */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Route>

        </Routes>

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

