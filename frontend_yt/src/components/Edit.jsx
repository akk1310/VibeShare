import React, { useState } from "react";

function Edit({ initialContent, onCancel, onSave }) {
    const [updatedContent, setUpdatedContent] = useState(initialContent);

    const handleSave = () => {
        onSave(updatedContent);
    };

    return (
        <div className="w-full text-sm">
            <input
                className="bg-[#222222] outline-none border-b w-3/4 p-2"
                value={updatedContent}
                autoFocus
                onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <div className="space-x-4 mt-3 w-3/4 inline-flex justify-end items-center">
                <span
                    className="bg-[#222222] py-1 px-3 font-normal rounded-lg hover:bg-black cursor-pointer"
                    onClick={onCancel}
                >
                    Cancel
                </span>
                <button
                    onClick={handleSave}
                    className="bg-[#222222] py-1 px-3 font-normal rounded-lg hover:bg-black cursor-pointer"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default Edit;