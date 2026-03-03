import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protege rotas que exigem autenticação.
 * Se o Firebase não estiver configurado, permite acesso (modo guest).
 * Se o usuário não estiver logado, exibe tela de login obrigatório.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, authAvailable, loginWithGoogle } = useAuth();

  if (!authAvailable) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="protected-route-gate">
        <div className="protected-route-card">
          <h1 className="protected-route-title">Login necessário</h1>
          <p className="protected-route-message">
            Faça login com sua conta Google para acessar sua lista pessoal e
            sincronizar entre dispositivos.
          </p>
          <button
            type="button"
            className="protected-route-login-btn"
            onClick={loginWithGoogle}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>
          <Link to="/" className="protected-route-back">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
