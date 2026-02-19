export default function EmptyState({ message }) {
  return (
    <div className="text-center py-5 text-muted">
      <p className="mb-0">{message || 'No data to display.'}</p>
    </div>
  );
}
