
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useElection } from '@/context/ElectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, BarChart, Calendar, Plus } from 'lucide-react';
import { Election } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const { elections, userVotes } = useElection();

  // Filter elections created by the current user
  const myElections = elections.filter(election => election.createdBy === user?.id);

  // Get the elections the user has voted in
  const votedElectionIds = userVotes
    .filter(vote => vote.userId === user?.id)
    .map(vote => vote.electionId);
  const votedElections = elections.filter(election => votedElectionIds.includes(election.id));

  // Active vs ended elections
  const activeElections = elections.filter(election => election.status === 'active');
  const endedElections = elections.filter(election => election.status === 'ended');

  const getTimeStatus = (election: Election) => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return 'Ends tomorrow';
    return `Ends in ${diffDays} days`;
  };

  return (
    <MainLayout requireAuth>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Link to="/create-election">
            <Button className="bg-vote-blue hover:bg-vote-blue/90">
              <Plus className="mr-2 h-4 w-4" /> Create Election
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Vote className="h-5 w-5 text-vote-blue mr-2" />
                <span className="text-2xl font-bold">{elections.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeElections.length} active, {endedElections.length} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-vote-purple mr-2" />
                <span className="text-2xl font-bold">{myElections.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Elections you've created
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-vote-green mr-2" />
                <span className="text-2xl font-bold">{votedElections.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Elections you've voted in
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">My Elections</h2>
            {myElections.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Vote className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-muted-foreground">You haven't created any elections yet</p>
                  <Link to="/create-election" className="mt-2">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Create Your First Election
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myElections.map((election) => (
                  <Link to={`/elections/${election.id}`} key={election.id}>
                    <Card className="h-full vote-card-hover">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{election.title}</CardTitle>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            election.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {election.status === 'active' ? 'Active' : 'Ended'}
                          </span>
                        </div>
                        <CardDescription className="line-clamp-2">{election.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Options: {election.options.length}</span>
                          <span className={`${
                            election.status === 'active' ? 'text-vote-blue' : 'text-muted-foreground'
                          }`}>
                            {getTimeStatus(election)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                <Link to="/create-election">
                  <Card className="h-full border-dashed flex flex-col items-center justify-center p-6 vote-card-hover">
                    <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">Create New Election</p>
                  </Card>
                </Link>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Active Elections</h2>
            {activeElections.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-muted-foreground">No active elections at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeElections.slice(0, 3).map((election) => (
                  <Link to={`/elections/${election.id}`} key={election.id}>
                    <Card className="h-full vote-card-hover">
                      <CardHeader>
                        <CardTitle>{election.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{election.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Options: {election.options.length}
                          </span>
                          <span className="text-vote-blue">{getTimeStatus(election)}</span>
                        </div>
                        {userVotes.some(vote => vote.electionId === election.id && vote.userId === user?.id) && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              You voted
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {activeElections.length > 3 && (
                  <Link to="/elections" className="flex items-center">
                    <Card className="w-full p-6 flex justify-center items-center">
                      <p className="text-vote-blue font-medium">View all elections</p>
                    </Card>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
