import { useAuth, useLogout } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <Button
            onClick={() => logout.mutate()}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <User className="h-6 w-6" />
              Welcome, {user?.firstName} {user?.lastName}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-200">
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Username:</span> {user?.username}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{' '}
                <span className="capitalize">{user?.role}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">
                Complete your profile and start {user?.role === 'creator' ? 'creating gigs' : 'browsing creators'}!
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">No recent activity yet.</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">
                {user?.role === 'creator'
                  ? 'Create your first gig to start earning'
                  : 'Browse gigs to find the perfect creator'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
