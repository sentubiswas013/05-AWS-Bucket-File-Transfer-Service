import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

function Navigation() {
  const location = useLocation();
  
  if (location.pathname === '/login') {
    return null;
  }
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AWS S3 Transfer Service
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin Panel
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}