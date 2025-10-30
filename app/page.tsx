"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User, Shield, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

// Types
type ComplaintStatus = "Pending" | "In Progress" | "Resolved";

interface Complaint {
  id: string;
  name: string;
  email: string;
  category: string;
  description: string;
  location: string;
  status: ComplaintStatus;
  date: string;
  photo?: string;
}

// Initial categories
const CATEGORIES = [
  "Roads and Infrastructure",
  "Sanitation",
  "Public Safety",
  "Utilities",
  "Parks and Recreation",
  "Other",
];

// Status colors
const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Resolved": "bg-green-100 text-green-800",
};

export default function CommunityComplaintReporter() {
  const [activeView, setActiveView] = useState<"form" | "dashboard" | "admin">("form");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Load complaints from localStorage on mount
  useEffect(() => {
    const savedComplaints = localStorage.getItem("complaints");
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    } else {
      // Initialize with sample data
      const sampleComplaints: Complaint[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          category: "Roads and Infrastructure",
          description: "Large pothole causing traffic issues on Main Street",
          location: "Main St & 1st Ave",
          status: "Pending",
          date: "2023-05-15",
          photo: "/placeholder-pothole.jpg",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          category: "Sanitation",
          description: "Garbage bins overflowed in the park",
          location: "Central Park",
          status: "In Progress",
          date: "2023-05-18",
        },
        {
          id: "3",
          name: "Robert Johnson",
          email: "robert@example.com",
          category: "Public Safety",
          description: "Street light out near the school",
          location: "Oak St & School Rd",
          status: "Resolved",
          date: "2023-05-10",
        },
      ];
      setComplaints(sampleComplaints);
      localStorage.setItem("complaints", JSON.stringify(sampleComplaints));
    }
  }, []);

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const complaint: Complaint = {
      id: Date.now().toString(),
      name,
      email,
      category,
      description,
      location,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      photo: photoPreview || undefined,
    };

    setComplaints((prev) => [...prev, complaint]);
    
    // Reset form
    setName("");
    setEmail("");
    setCategory("");
    setDescription("");
    setLocation("");
    setPhotoPreview(null);
    
    alert("Complaint submitted successfully!");
    setActiveView("dashboard");
  };

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin check (in real app, this would be secure authentication)
    if (adminCredentials.username === "admin" && adminCredentials.password === "password") {
      setIsAdmin(true);
      setActiveView("admin");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminCredentials({ username: "", password: "" });
    setActiveView("form");
  };

  // Filter complaints based on search and category
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      filterCategory === "all" || complaint.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Complaint Form View
  const ComplaintForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Report a Community Issue</CardTitle>
          <CardDescription className="text-base">
            Help us improve our community by reporting issues you encounter
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Issue Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location/Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="cursor-pointer"
                />
                {photoPreview && (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                      onClick={() => setPhotoPreview(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <div className="mt-6">
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveView("dashboard")}
              className="w-full sm:w-auto"
            >
              View Complaints
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Submit Complaint
            </Button>
          </CardFooter>
          </div>
        </form>
      </Card>
    </motion.div>
  );

  // Complaint Dashboard View
  const ComplaintDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Community Complaints</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track the status of reported issues in our community. Your voice helps make our neighborhood better.
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select onValueChange={setFilterCategory} value={filterCategory}>
              <SelectTrigger className="w-full md:w-64 h-12">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => setActiveView("form")}>
                Report New Issue
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredComplaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {complaint.photo ? (
                          <div className="relative">
                            <img
                              src={complaint.photo}
                              alt="Complaint"
                              className="h-32 w-32 object-cover rounded-lg border"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              <ImageIcon className="h-3 w-3 inline mr-1" />
                              Photo
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-100 border-2 border-dashed rounded-xl w-32 h-32 flex flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8" />
                            <span className="text-xs mt-2 text-center px-2">No image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between gap-3 mb-3">
                            <h3 className="text-xl font-semibold">{complaint.description}</h3>
                            <Badge className={`${statusColors[complaint.status]} px-3 py-1.5 text-sm font-medium`}>
                              {complaint.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{complaint.location}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(complaint.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <User className="h-4 w-4 mr-2" />
                              <span>{complaint.name}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2"></span>
                              <span>{complaint.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  // Admin Panel View
  const AdminPanel = () => {
    if (!isAdmin) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription className="text-base">
                Access the admin panel to manage complaints
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAdminLogin}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={adminCredentials.username}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="h-12"
                  />
                </div>
              </CardContent>
              <div className="mt-6">
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveView("form")}
                  className="w-full sm:w-auto"
                >
                  Back to Form
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Login
                </Button>
              </CardFooter>
              </div>
            </form>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage and update complaint statuses. Welcome back, Administrator.
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Select onValueChange={setFilterCategory} value={filterCategory}>
                  <SelectTrigger className="w-full md:w-64 h-12">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdminLogout} variant="outline" className="mt-2 md:mt-0">
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredComplaints.map((complaint) => (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {complaint.photo ? (
                            <div className="relative">
                              <img
                                src={complaint.photo}
                                alt="Complaint"
                                className="h-32 w-32 object-cover rounded-lg border"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                <ImageIcon className="h-3 w-3 inline mr-1" />
                                Photo
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-32 h-32 flex flex-col items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-8 w-8" />
                              <span className="text-xs mt-2 text-center px-2">No image</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex flex-wrap justify-between gap-3 mb-3">
                              <h3 className="text-xl font-semibold">{complaint.description}</h3>
                              <Badge className={`${statusColors[complaint.status]} px-3 py-1.5 text-sm font-medium`}>
                                {complaint.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{complaint.location}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{new Date(complaint.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <User className="h-4 w-4 mr-2" />
                                <span>{complaint.name}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2"></span>
                                <span>{complaint.category}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant={
                                  complaint.status === "Pending" ? "default" : "outline"
                                }
                                onClick={() => handleStatusChange(complaint.id, "Pending")}
                                className={complaint.status === "Pending" ? "" : "border-yellow-200"}
                              >
                                Set Pending
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  complaint.status === "In Progress" ? "default" : "outline"
                                }
                                onClick={() => handleStatusChange(complaint.id, "In Progress")}
                                className={complaint.status === "In Progress" ? "" : "border-blue-200"}
                              >
                                In Progress
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  complaint.status === "Resolved" ? "default" : "outline"
                                }
                                onClick={() => handleStatusChange(complaint.id, "Resolved")}
                                className={complaint.status === "Resolved" ? "" : "border-green-200"}
                              >
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Community Complaint Reporter</h1>
                <p className="text-sm text-muted-foreground">Making our community better together</p>
              </div>
            </div>
            <nav className="flex flex-wrap justify-center gap-2">
              <Button
                variant={activeView === "form" ? "default" : "ghost"}
                onClick={() => setActiveView("form")}
                className="rounded-full"
              >
                Report Issue
              </Button>
              <Button
                variant={activeView === "dashboard" ? "default" : "ghost"}
                onClick={() => setActiveView("dashboard")}
                className="rounded-full"
              >
                View Complaints
              </Button>
              <Button
                variant={activeView === "admin" ? "default" : "ghost"}
                onClick={() => setActiveView("admin")}
                className="rounded-full"
              >
                {isAdmin ? "Admin Panel" : "Admin Login"}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeView === "form" && <ComplaintForm />}
        {activeView === "dashboard" && <ComplaintDashboard />}
        {activeView === "admin" && <AdminPanel />}
      </main>

      <footer className="border-t py-8 mt-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              Community Complaint Reporter &copy; {new Date().getFullYear()}
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">Privacy Policy</Button>
              <Button variant="ghost" size="sm">Terms of Service</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}