import React, { useState } from 'react';

export default function GameDetailPage({ game, onBack, onSave, user }) {
  const [edited, setEdited] = useState({ ...game });
  const [packages, setPackages] = useState(game.packages || []);
  const [characters, setCharacters] = useState(game.characters || []);
  const [message, setMessage] = useState('');

  const updateField = (key, value) => setEdited({ ...edited, [key]: value });

  // Packages helpers
  const addPackage = () => setPackages([...packages, { id: Date.now(), amount: '', bonus: '', price: '' }]);
  const updatePackage = (id, key, value) => setPackages(packages.map(p => p.id === id ? { ...p, [key]: value } : p));
  const removePackage = (id) => setPackages(packages.filter(p => p.id !== id));

  // Characters helpers
  const addCharacter = () => setCharacters([...characters, { id: Date.now(), name: '', rarity: 1, image: '' }]);
  const updateCharacter = (id, key, value) => setCharacters(characters.map(c => c.id === id ? { ...c, [key]: value } : c));
  const removeCharacter = (id) => setCharacters(characters.filter(c => c.id !== id));

  const handleSave = () => {
    const updated = { ...edited, packages, characters };
    if (onSave) onSave(updated);
    setMessage('Saved successfully');
    setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto bg-slate-800/50 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Game: {game.name}</h1>
            <p className="text-sm text-gray-400">Modify game top-up details and shop characters</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="px-4 py-2 bg-slate-700 text-white rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">Save</button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded">{message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Name</label>
            <input value={edited.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full px-3 py-2 rounded bg-slate-700 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Status</label>
            <select value={edited.status || 'active'} onChange={(e) => updateField('status', e.target.value)} className="w-full px-3 py-2 rounded bg-slate-700 text-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Top-up Packages</h3>
          <div className="space-y-3">
            {packages.map(p => (
              <div key={p.id} className="grid grid-cols-12 gap-2 items-center">
                <input className="col-span-3 px-2 py-2 rounded bg-slate-700 text-white" placeholder="amount" value={p.amount} onChange={(e) => updatePackage(p.id, 'amount', e.target.value)} />
                <input className="col-span-4 px-2 py-2 rounded bg-slate-700 text-white" placeholder="bonus" value={p.bonus} onChange={(e) => updatePackage(p.id, 'bonus', e.target.value)} />
                <input className="col-span-3 px-2 py-2 rounded bg-slate-700 text-white" placeholder="price" value={p.price} onChange={(e) => updatePackage(p.id, 'price', e.target.value)} />
                <button onClick={() => removePackage(p.id)} className="col-span-2 px-3 py-2 bg-red-500/20 text-red-400 rounded">Remove</button>
              </div>
            ))}

            <div>
              <button onClick={addPackage} className="px-4 py-2 bg-green-500/20 text-green-300 rounded">+ Add package</button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Shop Characters</h3>
          <div className="space-y-3">
            {characters.map(c => (
              <div key={c.id} className="grid grid-cols-12 gap-2 items-center">
                <input className="col-span-4 px-2 py-2 rounded bg-slate-700 text-white" placeholder="name" value={c.name} onChange={(e) => updateCharacter(c.id, 'name', e.target.value)} />
                <input type="number" min={1} max={5} className="col-span-2 px-2 py-2 rounded bg-slate-700 text-white" value={c.rarity} onChange={(e) => updateCharacter(c.id, 'rarity', parseInt(e.target.value || 1))} />
                <input className="col-span-4 px-2 py-2 rounded bg-slate-700 text-white" placeholder="image path" value={c.image} onChange={(e) => updateCharacter(c.id, 'image', e.target.value)} />
                <button onClick={() => removeCharacter(c.id)} className="col-span-2 px-3 py-2 bg-red-500/20 text-red-400 rounded">Remove</button>
              </div>
            ))}

            <div>
              <button onClick={addCharacter} className="px-4 py-2 bg-green-500/20 text-green-300 rounded">+ Add character</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
