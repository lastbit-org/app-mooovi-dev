import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("404 — Página não encontrada");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <span
        style={{ fontSize: "5rem", lineHeight: 1 }}
        role="img"
        aria-label="Página não encontrada"
      >
        🎬
      </span>
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 900,
          color: "var(--accent)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "var(--text-secondary)",
          maxWidth: "24rem",
          margin: 0,
        }}
      >
        Essa página não existe. Parece que o filme sumiu da programação.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "0.5rem",
          padding: "0.75rem 2rem",
          backgroundColor: "var(--accent)",
          color: "#fff",
          borderRadius: "0.5rem",
          fontWeight: 700,
          fontSize: "1rem",
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Voltar para o início
      </Link>
    </div>
  );
}
