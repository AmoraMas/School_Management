import { useState } from "react";
import { useMemo } from "react";

function Table_Test({ data, columns, idField, onSelect }) {
  const [selectedId, setSelectedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [search, setSearch] = useState("");

  // Filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    const lower = search.toLowerCase();

    return data.filter((row) =>
      columns.some(({ accessor }) => {
        const value = row[accessor];
        return value && value.toString().toLowerCase().includes(lower);
      })
    );
  }, [search, data, columns]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    onSelect(id);
  };

  // Safely resolve nested accessors like "Students.first_name"
  const getValue = (obj, path) =>
    path.split('.').reduce((acc, key) => acc?.[key], obj);

  // Build columns if none were provided
  const buildColumns = (columns, data) => {
    if (columns && columns.length > 0) return columns;

    const firstRow = data[0] || {};

    return Object.keys(firstRow).map(key => ({
      label: key,
      accessor: key
    }));
  };

const finalColumns = buildColumns(columns, sortedData);

  return (
  <>
    <input
      type="text"
      placeholder="Search..."
      className="input input-bordered mb-3"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <table className="App-Table">
      <thead>
        <tr>
          {finalColumns.map(({ accessor, label }) => (
            <th
              key={accessor}
              className="border p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort(accessor)}
            >
              {label || accessor}
              {sortConfig.key === accessor && (
                <span> {sortConfig.direction === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
          ))}
          <th className="border p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {sortedData.map((row) => (
          <tr
            key={row[idField]}
            className={row[idField] === selectedId ? "Selected" : ""}
          >
            {finalColumns.map(({ accessor }) => (
              <td key={accessor} className="border p-2">
                {getValue(row, accessor) ?? "——"}
              </td>
            ))}

            <td className="border p-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSelect(row[idField])}
              >
                Select
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

}

export default Table_Test;