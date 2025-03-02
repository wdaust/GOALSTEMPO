import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, Award, BookOpen, Target } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`}
                    />
                    <AvatarFallback>
                      {user?.name?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Photo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <User className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="name"
                          value={user?.name || ""}
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="email"
                          value={user?.email || ""}
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="congregation">Congregation</Label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="congregation"
                          placeholder="Enter your congregation"
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Member Since</Label>
                      <div className="flex items-center border rounded-md px-3 py-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <Input
                          id="joinDate"
                          type="date"
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="achievements">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-500" />
                      Spiritual Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Bible Reading</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">12-Day Streak</Badge>
                          <Badge variant="secondary">Read 5 Books</Badge>
                          <Badge variant="secondary">Daily Reader</Badge>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Meeting Attendance</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Perfect Attendance</Badge>
                          <Badge variant="secondary">8-Week Streak</Badge>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Field Service</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">10+ Hours</Badge>
                          <Badge variant="secondary">3 Return Visits</Badge>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Goals Completed</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            Scripture Memorization
                          </Badge>
                          <Badge variant="secondary">Prayer Routine</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-500" />
                      Spiritual Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Total Bible Reading Time
                        </div>
                        <div className="text-2xl font-bold mt-1">42 hours</div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Field Service Hours
                        </div>
                        <div className="text-2xl font-bold mt-1">18 hours</div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Meetings Attended
                        </div>
                        <div className="text-2xl font-bold mt-1">24</div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Goals Completed
                        </div>
                        <div className="text-2xl font-bold mt-1">5</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          action: "Completed Bible reading goal",
                          date: "Today",
                        },
                        {
                          action: "Added new habit: Morning Prayer",
                          date: "Yesterday",
                        },
                        {
                          action: "Attended midweek meeting",
                          date: "2 days ago",
                        },
                        {
                          action: "Completed 2 hours of field service",
                          date: "3 days ago",
                        },
                        {
                          action: "Added new spiritual goal",
                          date: "1 week ago",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <span>{activity.action}</span>
                          <span className="text-sm text-muted-foreground">
                            {activity.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default ProfilePage;
