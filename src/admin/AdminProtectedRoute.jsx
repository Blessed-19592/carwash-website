import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function AdminProtectedRoute({ children }) {
const [status, setStatus] = useState('checking');

useEffect(() => {
let active = true;


async function verifySession() {
  try {
    await adminApi.getCurrentAdmin();

    if (active) {
      setStatus('authenticated');
    }
  } catch (error) {
    if (active) {
      setStatus(
        error.status === 401 ? 'unauthenticated' : 'error'
      );
    }
  }
}

verifySession();

return () => {
  active = false;
};


}, []);

if (status === 'checking') {
return ( <div className="admin-loading-screen"> <LoaderCircle className="admin-spinner" size={34} /> <p>Verifying administrator session...</p> </div>
);
}

if (status === 'unauthenticated') {
return <Navigate to="/admin/login" replace />;
}

if (status === 'error') {
return ( <div className="admin-loading-screen"> <p>Unable to verify your session.</p>
<button
className="admin-primary-button"
onClick={() => window.location.reload()}
>
Try Again </button> </div>
);
}

return children;
}
