import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faDatabase, faChartBar, faCog, faBullhorn, faPlus, faTrash, 
  faEdit, faSave, faTimes, faKey, faCoins, faPercentage, faCheck, 
  faStar, faRocket, faEye, faCrown, faLock, faUnlock, faSearch, 
  faFilter, faDownload, faUpload, faSync, faBan, faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  username: string;
  email: string;
  birthDate?: string;
  zodiacSign?: string;
  isPremium: boolean;
  createdAt: string;
  lastActive?: string;
  totalFortunes: number;
  totalSpent: number;
}

interface PromotionalContent {
  id: number;
  title: string;
  content: string;
  category: string;
  adType: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  conversions: number;
}

export default function EnhancedAdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newPromo, setNewPromo] = useState({
    title: "",
    content: "",
    category: "fortune_ads",
    adType: "banner",
    platform: "website"
  });
  const { toast } = useToast();

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    }
  });

  // Fetch promotional content
  const { data: promos = [], isLoading: promosLoading } = useQuery({
    queryKey: ["/api/promotional-content"],
    queryFn: async () => {
      const response = await fetch("/api/promotional-content?active=true");
      if (!response.ok) throw new Error("Failed to fetch promos");
      return response.json();
    }
  });

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    refetchInterval: 30000
  });

  // Create promotional content
  const createPromoMutation = useMutation({
    mutationFn: async (promo: typeof newPromo) => {
      return apiRequest("/api/promotional-content", {
        method: "POST",
        body: JSON.stringify(promo)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotional-content"] });
      toast({
        title: "Success",
        description: "Promotional content created and is now live!",
      });
      setNewPromo({
        title: "",
        content: "",
        category: "fortune_ads",
        adType: "banner",
        platform: "website"
      });
    }
  });

  // Delete promotional content
  const deletePromoMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/promotional-content/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotional-content"] });
      toast({
        title: "Deleted",
        description: "Promotional content removed",
      });
    }
  });

  // Toggle user premium status
  const togglePremiumMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("admin_token");
      return apiRequest(`/api/admin/users/${userId}/toggle-premium`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Updated",
        description: "User premium status updated",
      });
    }
  });

  // Ban/Unban user
  const toggleBanMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("admin_token");
      return apiRequest(`/api/admin/users/${userId}/toggle-ban`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Updated",
        description: "User ban status updated",
      });
    }
  });

  const filteredUsers = users.filter((user: User) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-['Cinzel'] text-amber-500 mb-2">Admin Control Center</h1>
          <p className="text-purple-300">Manage users, content, and analytics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-purple-900/30 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-purple-900/30 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Premium Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats?.premiumUsers || 0}</div>
              <Progress value={30} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-purple-900/30 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Active Promos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{promos.length}</div>
              <Progress value={60} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-purple-900/30 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Revenue Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${stats?.revenueToday || 0}</div>
              <Progress value={45} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-purple-900/50">
            <TabsTrigger value="overview">
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="promotions">
              <FontAwesomeIcon icon={faBullhorn} className="mr-2" />
              Promotions
            </TabsTrigger>
            <TabsTrigger value="settings">
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faEye} className="text-4xl text-purple-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{stats?.totalViews || 0}</p>
                    <p className="text-sm text-purple-300">Total Views</p>
                  </div>
                  <div className="text-center">
                    <FontAwesomeIcon icon={faStar} className="text-4xl text-amber-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{stats?.fortunesGenerated || 0}</p>
                    <p className="text-sm text-purple-300">Fortunes Generated</p>
                  </div>
                  <div className="text-center">
                    <FontAwesomeIcon icon={faRocket} className="text-4xl text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{stats?.conversionRate || 0}%</p>
                    <p className="text-sm text-purple-300">Conversion Rate</p>
                  </div>
                  <div className="text-center">
                    <FontAwesomeIcon icon={faCoins} className="text-4xl text-yellow-400 mb-2" />
                    <p className="text-2xl font-bold text-white">${stats?.totalRevenue || 0}</p>
                    <p className="text-sm text-purple-300">Total Revenue</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button className="bg-purple-700 hover:bg-purple-600">
                      <FontAwesomeIcon icon={faSync} className="mr-2" />
                      Sync Data
                    </Button>
                    <Button className="bg-green-700 hover:bg-green-600">
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Export Users
                    </Button>
                    <Button className="bg-amber-600 hover:bg-amber-500">
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />
                      Import Content
                    </Button>
                    <Button className="bg-red-700 hover:bg-red-600">
                      <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                      Backup DB
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">User Management</CardTitle>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-purple-800/50 border-purple-600"
                  />
                  <Button className="bg-amber-600 hover:bg-amber-500">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-700">
                        <th className="text-left p-2 text-purple-300">User</th>
                        <th className="text-left p-2 text-purple-300">Zodiac</th>
                        <th className="text-left p-2 text-purple-300">Status</th>
                        <th className="text-left p-2 text-purple-300">Activity</th>
                        <th className="text-left p-2 text-purple-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: User) => (
                        <tr key={user.id} className="border-b border-purple-800">
                          <td className="p-2">
                            <div>
                              <p className="text-white font-semibold">{user.username}</p>
                              <p className="text-purple-400 text-sm">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className="bg-purple-700">
                              {user.zodiacSign || "Unknown"}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {user.isPremium ? (
                              <Badge className="bg-amber-600">
                                <FontAwesomeIcon icon={faCrown} className="mr-1" />
                                Premium
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-600">Free</Badge>
                            )}
                          </td>
                          <td className="p-2">
                            <div className="text-sm">
                              <p className="text-white">{user.totalFortunes} fortunes</p>
                              <p className="text-purple-400">${user.totalSpent} spent</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="bg-purple-700 hover:bg-purple-600"
                                onClick={() => togglePremiumMutation.mutate(user.id)}
                              >
                                <FontAwesomeIcon icon={user.isPremium ? faLock : faUnlock} />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-700 hover:bg-red-600"
                                onClick={() => toggleBanMutation.mutate(user.id)}
                              >
                                <FontAwesomeIcon icon={faBan} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Promotional Content Manager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create New Promo */}
                <div className="bg-purple-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4">Create New Promotion</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-purple-300">Title</Label>
                      <Input
                        value={newPromo.title}
                        onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                        placeholder="Catchy promo title"
                        className="bg-purple-700/50 border-purple-600"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300">Ad Type</Label>
                      <Select
                        value={newPromo.adType}
                        onValueChange={(value) => setNewPromo({ ...newPromo, adType: value })}
                      >
                        <SelectTrigger className="bg-purple-700/50 border-purple-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banner">Banner</SelectItem>
                          <SelectItem value="inline">Inline</SelectItem>
                          <SelectItem value="footer">Footer</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-purple-300">Content</Label>
                      <Textarea
                        value={newPromo.content}
                        onChange={(e) => setNewPromo({ ...newPromo, content: e.target.value })}
                        placeholder="Promotional message..."
                        className="bg-purple-700/50 border-purple-600"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        onClick={() => createPromoMutation.mutate(newPromo)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-purple-950"
                        disabled={!newPromo.title || !newPromo.content}
                      >
                        <FontAwesomeIcon icon={faRocket} className="mr-2" />
                        Launch Promotion
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Promotions */}
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-4">Active Promotions</h3>
                  <div className="space-y-3">
                    {promos.map((promo: PromotionalContent) => (
                      <motion.div
                        key={promo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-purple-800/30 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-grow">
                            <h4 className="text-amber-400 font-semibold">{promo.title}</h4>
                            <p className="text-purple-300 text-sm mt-1">{promo.content}</p>
                            <div className="flex gap-3 mt-3">
                              <Badge className="bg-purple-700">
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                                {promo.impressions} views
                              </Badge>
                              <Badge className="bg-green-700">
                                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                {promo.clicks} clicks
                              </Badge>
                              <Badge className="bg-amber-700">
                                <FontAwesomeIcon icon={faPercentage} className="mr-1" />
                                {promo.conversions} conversions
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-red-700 hover:bg-red-600"
                              onClick={() => deletePromoMutation.mutate(promo.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">Platform Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-purple-300">Maintenance Mode</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-purple-300">Auto-Promotions</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-purple-300">AI Features</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-purple-300">Analytics Tracking</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">Security</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-purple-700 hover:bg-purple-600">
                        <FontAwesomeIcon icon={faKey} className="mr-2" />
                        Change Admin Password
                      </Button>
                      <Button className="w-full bg-purple-700 hover:bg-purple-600">
                        <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                        Manage Admin Users
                      </Button>
                      <Button className="w-full bg-red-700 hover:bg-red-600">
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        Force Logout All Users
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}