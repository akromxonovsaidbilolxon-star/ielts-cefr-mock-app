import type { CambridgeSource } from '../content/cambridge/types';

/**
 * Attribution notice. It appears on every Cambridge test page, as agreed with
 * the owner when this material was added: the book is used for private
 * classroom teaching, so the source must stay visible to whoever sits the test.
 *
 * Do not remove this component from the pages.
 */
export default function CambridgeSourceNote({
  source,
  compact = false,
}: {
  source: CambridgeSource;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="csource csource-sm">
        <b>{source.bookTitle}</b> · {source.rights}
      </div>
    );
  }

  return (
    <div className="csource">
      <div className="csource-title">Source &amp; permitted use</div>
      <p>{source.rights}</p>
      <p className="tiny muted" style={{ marginBottom: 0 }}>
        {source.provenance}
      </p>
    </div>
  );
}
