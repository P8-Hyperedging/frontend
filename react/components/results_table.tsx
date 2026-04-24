import { useEffect, useState } from "react";
import { ModelResult } from "@shared/model_output.ts";

export default function ResultsTable() {
  const [tableData, setTableData] = useState<ModelResult[]>([]);
  const [sortKey, setSortKey] = useState<keyof ModelResult | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key as keyof ModelResult);
      setSortDir("asc");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const modelResultsRes = await fetch("/api/model-results");
      const modelResultsData = await modelResultsRes.json();
      const modelResultsParsed = modelResultsData.map((data: ModelResult) => {
        return ModelResult.parse(data);
      });

      setTableData(modelResultsParsed);
    }

    fetchData();
  }, [tableData]);

  if (tableData.length === 0) return;

  const filteredData = tableData.filter((entry) =>
    Object.values(entry).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered w-full max-w-sm mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto w-full">
        <table className="table">
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="cursor-pointer select-none"
                >
                  {key} {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry: ModelResult, i: number) => (
              <tr key={i}>
                {Object.values(entry).map((value, j) => (
                  <td key={j} className="max-w-xs truncate">
                    {value instanceof Date
                      ? value.toLocaleString("en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                      : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
