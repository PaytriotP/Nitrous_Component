import './SpecTable.css';

interface SpecRow {
  key: string;
  value: React.ReactNode;
}

interface SpecTableProps {
  specs: SpecRow[];
}

export default function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="spec-table-wrapper">
      <table className="spec-table">
        <tbody>
          {specs.map((spec, index) => (
            <tr key={index}>
              <td className="spec-key text-label">{spec.key}</td>
              <td className="spec-value text-mono">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
