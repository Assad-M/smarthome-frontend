// ===============================
// src/pages/admin/LogsTab.tsx
// FULL IMPLEMENTATION
// ===============================
import { useEffect, useState } from "react";
import api from "../../api/api";

interface Log {
  id: number;
  email: string;
  action: string;
  created_at: string;
}

export default function LogsTab() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    api.get("/logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Login / Logout Logs</h1>

      <div className="bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-2">{log.email}</td>
                <td className="p-2 capitalize">{log.action}</td>
                <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}