import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function NewPopularPage() {
  useDocumentTitle("Em Alta");
  return <p className="loading">New &amp; Popular — coming soon</p>;
}
