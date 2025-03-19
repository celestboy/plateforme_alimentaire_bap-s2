import React, { useState } from "react";

interface Props {
  onSubmit: (lieu: string, heure: string) => void;
}

export default function NewValidationForm({ onSubmit }: Props) {
  const [lieu, setLieu] = useState("");
  const [heure, setHeure] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(lieu, heure);
  };

  return (
    <div className="mx-auto bg-black w-full h-[200px] z-40">
      <form onSubmit={handleSubmit} className="bg-white w-[700px] z-50">
        <div>
          <label>Lieu</label>
          <select
            name="lieu"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
          >
            <option value="Option A">Option A</option>
            <option value="Option B">Option B</option>
            <option value="Option C">Option C</option>
            <option value="Option D">Option D</option>
          </select>
        </div>
        <div>
          <label>Heure</label>
          <input
            type="datetime-local"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
          />
        </div>
        <button type="submit">Je valide l&apos;heure et le lieu</button>
      </form>
    </div>
  );
}
