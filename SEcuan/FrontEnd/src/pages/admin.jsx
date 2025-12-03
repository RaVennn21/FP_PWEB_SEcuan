import React, { useState } from 'react';
import GameDetailPage from './GameDetail.jsx';


export default function AdminPage({ onBack, user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([
    { id: 1, username: 'player_123', email: 'player@example.com', joined: '2025-11-15', status: 'active', spent: 'Rp. 500.000' },
    { id: 2, username: 'gamer_456', email: 'gamer@example.com', joined: '2025-11-20', status: 'active', spent: 'Rp. 1.200.000' },
    { id: 3, username: 'casual_789', email: 'casual@example.com', joined: '2025-12-01', status: 'inactive', spent: 'Rp. 0' },
    { id: 4, username: 'pro_player', email: 'pro@example.com', joined: '2025-10-05', status: 'active', spent: 'Rp. 3.500.000' },
  ]);

  const [games, setGames] = useState([
    { id: 1, name: 'Genshin Impact', status: 'active', revenue: 'Rp. 15.200.000', orders: 245 },
    { id: 2, name: 'Honkai Star Rail', status: 'active', revenue: 'Rp. 8.500.000', orders: 152 },
    { id: 3, name: 'Zenless Zone Zero', status: 'active', revenue: 'Rp. 4.800.000', orders: 89 },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, user: 'player_123', game: 'Genshin Impact', amount: 'Rp. 73.000', date: '2025-12-03', status: 'completed' },
    { id: 2, user: 'gamer_456', game: 'Honkai Star Rail', amount: 'Rp. 200.000', date: '2025-12-02', status: 'completed' },
    { id: 3, user: 'pro_player', game: 'Genshin Impact', amount: 'Rp. 500.000', date: '2025-12-01', status: 'pending' },
  ]);

  const [showAddGame, setShowAddGame] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', status: 'active' });
  const [editingGame, setEditingGame] = useState(null);

  // Stats
  const totalUsers = users.length;
  const totalGames = games.length;
  const totalRevenue = games.reduce((sum, g) => {
    const amount = parseInt(g.revenue.replace(/[^0-9]/g, ''));
    return sum + amount;
  }, 0);
  const totalOrders = orders.length;

  // Delete user
  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Delete game
  const deleteGame = (id) => {
    if (confirm('Are you sure you want to delete this game?')) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  // Add game
  const handleAddGame = () => {
    if (newGame.name.trim()) {
      setGames([
        ...games,
        {
          id: Math.max(...games.map(g => g.id), 0) + 1,
          name: newGame.name,
          status: newGame.status,
          revenue: 'Rp. 0',
          orders: 0,
        },
      ]);
      setNewGame({ name: '', status: 'active' });
      setShowAddGame(false);
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

  const handleSaveGame = (updated) => {
    setGames(games.map(g => g.id === updated.id ? { ...g, ...updated } : g));
    setEditingGame(null);
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
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

          {/* Total Orders */}
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

        {/* Tab Content */}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">📊 Dashboard Overview</h2>
              <div className="space-y-4 text-gray-300">
                <p>Welcome to the Admin Dashboard! Here you can manage:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><span className="text-pink-400 font-semibold">Users</span> - View, edit, and manage user accounts</li>
                  <li><span className="text-pink-400 font-semibold">Games</span> - Add, edit, and manage game listings</li>
                  <li><span className="text-pink-400 font-semibold">Orders</span> - Track and manage all transactions</li>
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
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all">
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
                    <span className="text-gray-400">Payment Gateway</span>
                    <span className="text-green-400 font-semibold">● Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">👥 User Management</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Spent</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white font-semibold">{user.username}</td>
                    <td className="py-3 px-4 text-gray-400">{user.email}</td>
                    <td className="py-3 px-4 text-gray-400">{user.joined}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.status}
                        onChange={(e) => updateUserStatus(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold bg-transparent border ${
                          user.status === 'active'
                            ? 'border-green-500/30 text-green-400'
                            : 'border-red-500/30 text-red-400'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{user.spent}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs font-semibold transition">Edit</button>
                      <button onClick={() => deleteUser(user.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs font-semibold transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">🎮 Game Management</h2>
              <button
                onClick={() => setShowAddGame(!showAddGame)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all"
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
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
                    <select
                      value={newGame.status}
                      onChange={(e) => setNewGame({ ...newGame, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <button
                    onClick={handleAddGame}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Add Game
                  </button>
                </div>
              </div>
            )}

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
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
                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue</span>
                      <span className="text-green-400 font-semibold">{game.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orders</span>
                      <span className="text-blue-400 font-semibold">{game.orders}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingGame(game)} className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold transition">Edit</button>
                    <button onClick={() => deleteGame(game.id)} className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold transition">Delete</button>
                  </div>
                </div>
              ))}
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-x-auto">
            <h2 className="text-2xl font-bold text-white mb-6">📦 Order Management</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Game</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white font-semibold">#{order.id}</td>
                    <td className="py-3 px-4 text-gray-400">{order.user}</td>
                    <td className="py-3 px-4 text-gray-400">{order.game}</td>
                    <td className="py-3 px-4 text-green-400 font-semibold">{order.amount}</td>
                    <td className="py-3 px-4 text-gray-400">{order.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}