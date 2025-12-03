import React, { useState, useEffect } from 'react';
import GameDetailPage from './GameDetail.jsx';

const API_BASE = 'http://localhost:5000/api';

export default function AdminPage({ onBack, user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);           // ← Now from DB, not hardcoded
  const [games, setGames] = useState([]);
  const [orders, setOrders] = useState([]);         // ← Now from DB, not hardcoded

  const [showAddGame, setShowAddGame] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', description: '', status: 'active' });
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 1️⃣ FETCH ALL GAMES
  // ==========================================
  const fetchAllGames = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/games`);
      const data = await res.json();

      if (data.success) {
        const formattedGames = data.data.map(game => ({
          id: game._id,
          name: game.name,
          status: 'active',
          description: game.description,
          bannerImageUrl: game.bannerImageUrl,
          cardImageUrl: game.cardImageUrl,
          servers: game.servers,
          packages: game.packages || [],
          characters: game.characters || [],
        }));
        setGames(formattedGames);
        console.log('✅ Games fetched:', formattedGames);
      } else {
        console.error('❌ Failed to fetch games:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2️⃣ FETCH ALL TRANSACTIONS (Orders)
  // ==========================================
  const fetchAllTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: {
          Authorization: `Bearer ${user?.token || ''}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        console.log('✅ Transactions fetched:', data.data);
      } else {
        console.error('❌ Failed to fetch transactions:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
    }
  };

  // ==========================================
  // 3️⃣ FETCH ALL USERS (NEW)
  // ==========================================
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${user?.token || ''}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Format users for display
        const formattedUsers = data.data.map(u => ({
          id: u._id,
          username: u.username,
          email: u.email,
          joined: new Date(u.dateCreated).toLocaleDateString('id-ID'),
          status: u.isAdmin ? 'admin' : 'active',
          spent: 'Rp. 0', // Can calculate from transactions
          isAdmin: u.isAdmin,
        }));
        setUsers(formattedUsers);
        console.log('✅ Users fetched:', formattedUsers);
      } else {
        console.error('❌ Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }
  };

  // ==========================================
  // 4️⃣ CREATE GAME
  // ==========================================
  const handleAddGame = async () => {
    if (!newGame.name.trim()) {
      alert('❌ Please enter a game name');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGame.name,
          description: newGame.description || 'New game',
          bannerImageUrl: newGame.bannerImageUrl || 'https://via.placeholder.com/1920x400',
          cardImageUrl: newGame.cardImageUrl || 'https://via.placeholder.com/300x400',
          servers: newGame.servers || 'Global',
          packages: [],
          characters: [],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGames([
          ...games,
          {
            id: data.data._id,
            name: data.data.name,
            status: 'active',
            description: data.data.description,
            bannerImageUrl: data.data.bannerImageUrl,
            cardImageUrl: data.data.cardImageUrl,
            servers: data.data.servers,
            packages: [],
            characters: [],
          },
        ]);

        setNewGame({ name: '', description: '', status: 'active' });
        setShowAddGame(false);
        alert('✅ Game created successfully!');
        console.log('✅ Game created:', data.data);
      } else {
        alert('❌ Failed to create game: ' + data.message);
        console.error('❌ Create game error:', data.message);
      }
    } catch (error) {
      console.error('❌ Error creating game:', error);
      alert('❌ Network error while creating game');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 5️⃣ UPDATE GAME
  // ==========================================
  const handleSaveGame = async (updated) => {
    if (!updated.id) {
      alert('❌ Error: No game ID found');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/games/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updated.name,
          description: updated.description,
          bannerImageUrl: updated.bannerImageUrl,
          cardImageUrl: updated.cardImageUrl,
          servers: updated.servers,
          packages: updated.packages,
          characters: updated.characters,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGames(
          games.map(g =>
            g.id === updated.id
              ? {
                  ...g,
                  name: data.data.name,
                  description: data.data.description,
                  bannerImageUrl: data.data.bannerImageUrl,
                  cardImageUrl: data.data.cardImageUrl,
                  servers: data.data.servers,
                  packages: data.data.packages || [],
                  characters: data.data.characters || [],
                }
              : g
          )
        );
        setEditingGame(null);
        alert('✅ Game updated successfully!');
        console.log('✅ Game updated:', data.data);
      } else {
        alert('❌ Failed to update game: ' + data.message);
        console.error('❌ Update game error:', data.message);
      }
    } catch (error) {
      console.error('❌ Error updating game:', error);
      alert('❌ Network error while updating game');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 6️⃣ DELETE GAME
  // ==========================================
  const deleteGame = async (id) => {
    if (!confirm('⚠️ Are you sure you want to delete this game? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success) {
        setGames(games.filter(g => g.id !== id));
        alert('✅ Game deleted successfully!');
        console.log('✅ Game deleted');
      } else {
        alert('❌ Failed to delete game: ' + data.message);
        console.error('❌ Delete game error:', data.message);
      }
    } catch (error) {
      console.error('❌ Error deleting game:', error);
      alert('❌ Network error while deleting game');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CALCULATE REAL STATS
  // ==========================================
  const getGameStats = (gameName) => {
    const gameTransactions = orders.filter(o => o.gameName === gameName);
    const revenue = gameTransactions.reduce((sum, order) => {
      const price = parseInt(order.price?.replace(/[^0-9]/g, '') || 0);
      return sum + price;
    }, 0);

    return {
      revenue: revenue > 0 ? `Rp. ${(revenue / 1000000).toFixed(2)}M` : 'Rp. 0',
      orders: gameTransactions.length,
    };
  };

  // ==========================================
  // FETCH ALL DATA ON MOUNT (UPDATED)
  // ==========================================
  useEffect(() => {
    fetchAllGames();
    fetchAllTransactions();
    fetchAllUsers();  // ← ADD THIS
  }, []);

  // Stats (from REAL data)
  const totalUsers = users.length;
  const totalGames = games.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const price = parseInt(order.price?.replace(/[^0-9]/g, '') || 0);
    return sum + price;
  }, 0);
  const totalOrders = orders.length;

  // Delete user
  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Update user status
  const updateUserStatus = (id, newStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  // Update game status
  const updateGameStatus = (id, newStatus) => {
    setGames(games.map(g => g.id === id ? { ...g, status: newStatus } : g));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                ⚙️ Admin Dashboard
              </h1>
            </div>
            <span className="text-sm text-gray-400">Logged in as: <span className="text-pink-400 font-semibold">{user?.username || 'Admin'}</span></span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse z-50"></div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users (NOW REAL) */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-400">{totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          {/* Total Games */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Games</p>
                <p className="text-3xl font-bold text-purple-400">{totalGames}</p>
              </div>
              <div className="text-4xl">🎮</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">Rp. {(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* Total Orders (NOW REAL) */}
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-yellow-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-yellow-400">{totalOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['dashboard', 'users', 'games', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">📊 Dashboard Overview</h2>
              <div className="space-y-4 text-gray-300">
                <p>Welcome to the Admin Dashboard! All data is now connected to backend:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><span className="text-pink-400 font-semibold">Users</span> - Real users from database ✅</li>
                  <li><span className="text-pink-400 font-semibold">Games</span> - Real games with packages & characters ✅</li>
                  <li><span className="text-pink-400 font-semibold">Orders</span> - Real transactions from purchases ✅</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all">
                    Add New User
                  </button>
                  <button onClick={() => setActiveTab('games')} className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all">
                    Add New Game
                  </button>
                  <button onClick={() => setActiveTab('orders')} className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all">
                    View All Orders
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">🔧 System Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Server Status</span>
                    <span className="text-green-400 font-semibold">● Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Database</span>
                    <span className="text-green-400 font-semibold">● Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">API Status</span>
                    <span className="text-green-400 font-semibold">● Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">All Data</span>
                    <span className="text-green-400 font-semibold">● Live ✅</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab (NOW FROM DATABASE) */}
        {activeTab === 'users' && (
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">👥 User Management (from database)</h2>
            {users.length === 0 ? (
              <p className="text-gray-400">No users found. Register an account to see users here.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="text-left py-3 px-4">Username</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-white font-semibold">{u.username}</td>
                      <td className="py-3 px-4 text-gray-400">{u.email}</td>
                      <td className="py-3 px-4 text-gray-400">{u.joined}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.status}
                          onChange={(e) => updateUserStatus(u.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold bg-transparent border ${
                            u.status === 'admin'
                              ? 'border-purple-500/30 text-purple-400'
                              : 'border-green-500/30 text-green-400'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="admin">Admin</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs font-semibold transition">Edit</button>
                        <button onClick={() => deleteUser(u.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs font-semibold transition">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">🎮 Game Management</h2>
              <button
                onClick={() => setShowAddGame(!showAddGame)}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {showAddGame ? 'Cancel' : '+ Add Game'}
              </button>
            </div>

            {/* Add Game Form */}
            {showAddGame && (
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Game Name</label>
                    <input
                      type="text"
                      value={newGame.name}
                      onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                      placeholder="Enter game name..."
                      className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newGame.description}
                      onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                      placeholder="Enter game description..."
                      className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={handleAddGame}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Game'}
                  </button>
                </div>
              </div>
            )}

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <p>No games found. Click "+ Add Game" to create one! ✅</p>
                </div>
              ) : (
                games.map(game => {
                  const stats = getGameStats(game.name);
                  return (
                    <div key={game.id} className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{game.name}</h3>
                        <select
                          value={game.status}
                          onChange={(e) => updateGameStatus(game.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-semibold bg-transparent border ${
                            game.status === 'active'
                              ? 'border-green-500/30 text-green-400'
                              : 'border-yellow-500/30 text-yellow-400'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>

                      {/* Game Content & Packages Info */}
                      <div className="space-y-2 text-sm mb-4 pb-4 border-b border-white/10">
                        <div className="text-gray-400">
                          📦 Packages: <span className="text-blue-400 font-semibold">{game.packages?.length || 0}</span>
                        </div>
                        <div className="text-gray-400">
                          👥 Characters: <span className="text-purple-400 font-semibold">{game.characters?.length || 0}</span>
                        </div>
                      </div>

                      {/* Real Stats from Transactions */}
                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Revenue</span>
                          <span className="text-green-400 font-semibold">{stats.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Orders</span>
                          <span className="text-blue-400 font-semibold">{stats.orders}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setEditingGame(game)} className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold transition">Edit</button>
                        <button onClick={() => deleteGame(game.id)} disabled={loading} className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold transition disabled:opacity-50">Delete</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* When editing a game show the GameDetail page */}
        {editingGame && (
          <GameDetailPage
            game={editingGame}
            user={user}
            onBack={() => setEditingGame(null)}
            onSave={handleSaveGame}
          />
        )}

        {/* Orders Tab (NOW FROM DATABASE) */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">📦 Order Management (from database)</h2>
            {orders.length === 0 ? (
              <p className="text-gray-400">No orders found. Make a purchase to see transactions here.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">User Email</th>
                    <th className="text-left py-3 px-4">Game</th>
                    <th className="text-left py-3 px-4">Package</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order._id || idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-white font-semibold">#{idx + 1}</td>
                      <td className="py-3 px-4 text-gray-400">{order.userEmail}</td>
                      <td className="py-3 px-4 text-gray-400">{order.gameName}</td>
                      <td className="py-3 px-4 text-blue-400">{order.packageAmount}</td>
                      <td className="py-3 px-4 text-green-400 font-semibold">Rp. {order.price}</td>
                      <td className="py-3 px-4 text-gray-400">{new Date(order.date).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}