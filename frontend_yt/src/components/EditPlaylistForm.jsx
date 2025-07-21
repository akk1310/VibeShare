import React, { useState } from "react";

function EditPlaylistForm({ playlist, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;
    onSave(formData); // Pass data back to parent
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-[#111] border border-gray-700 p-5 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-4 text-white">Edit Playlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm mb-1 text-gray-300">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#222] text-white border border-gray-600 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1 text-gray-300">Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#222] text-white border border-gray-600 rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlaylistForm;
