
import { useState, useEffect } from "react";
import api from "../../api/api";
import type { Service, Category } from "../../types/types";

interface Props {
  services: Service[];
  refreshServices: () => Promise<void>; // 👈 changed
  
}

const ServicesTab: React.FC<Props> = ({ services, refreshServices }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
const [baseHours, setBaseHours] = useState(1);
const [maxworkers, setmaxworkers] = useState(1);
const [categories, setCategories] = useState<Category[]>([]);
const [categoryId, setCategoryId] = useState<number | null>(null);

useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch {
      alert("Failed to load categories");
    }
  };

  loadCategories();
}, []);

  const createService = async () => {
    try {
      await api.post("/services", { name, price, description, base_hours: baseHours, max_workers: maxworkers, category_id: categoryId });

      await refreshServices(); // ✅ re-fetch with JOINs

      setName("");
      setPrice(0);
      setDescription("");
      alert("Service created successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create service");
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Are you sure to delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      await refreshServices(); // ✅ keep state clean
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Service Form */}
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Add New Service</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-1"
          />
          <select
            value={categoryId ?? ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="border p-1"
              >
                  <option value="" disabled>
                        Select Category
                          </option>
                            {categories.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>

<input
  type="number"
  placeholder="Base Hours"
  value={baseHours}
  onChange={(e) => setBaseHours(Number(e.target.value))}
  className="border p-1"
/>

<input
  type="number"
  placeholder="Max Hours"
  value={maxworkers}
  onChange={(e) => setmaxworkers(Number(e.target.value))}
  className="border p-1"
/>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border p-1"
          
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1 flex-1"
          />
          
          <button
            onClick={createService}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Services Table */}
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
<th>Category</th>
<th>Base Hours</th>
<th>Max workers</th>
<th>Price</th>
<th>Description</th>

          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-t">
              <td>{s.name}</td>
<td>{s.category_name ?? "-"}</td>
<td>{s.base_hours}</td>
<td>{s.max_workers}</td>
<td>${s.price}</td>
<td>{s.description}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteService(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTab;
