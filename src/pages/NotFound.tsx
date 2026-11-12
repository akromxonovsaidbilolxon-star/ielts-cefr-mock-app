import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty" style={{ marginTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>Page not found</h1>
      <p className="muted">That page does not exist in this app.</p>
      <Link to="/" className="btn" style={{ marginTop: '0.6rem' }}>
        Back to home
      </Link>
    </div>
  );
}
