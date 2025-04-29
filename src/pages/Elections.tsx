
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useElection } from '@/context/ElectionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Election } from '@/types';
import { Search, Calendar, Plus } from 'lucide-react';

const Elections = () => {
  const { elections, userVotes } = useElection();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter active and ended elections
  const activeElections = elections.filter(election => election.status === 'active');
  const endedElections = elections.filter(election => election.status === 'ended');
  
  // Filter elections based on search term
  const filterElections = (electionList: Election[]) => {
    if (!searchTerm) return electionList;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return electionList.filter(election => 
      election.title.toLowerCase().includes(lowercasedSearch) || 
      election.description.toLowerCase().includes(lowercasedSearch)
    );
  };
  
  const filteredActive = filterElections(activeElections);
  const filteredEnded = filterElections(endedElections);
  
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
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Elections</h1>
          {user && (
            <Link to="/create-election">
              <Button className="bg-vote-blue hover:bg-vote-blue/90">
                <Plus className="mr-2 h-4 w-4" /> Create Election
              </Button>
            </Link>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search elections..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="active">Active ({filteredActive.length})</TabsTrigger>
            <TabsTrigger value="ended">Ended ({filteredEnded.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            {filteredActive.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                  {searchTerm ? (
                    <p className="text-muted-foreground">No active elections found matching "{searchTerm}"</p>
                  ) : (
                    <p className="text-muted-foreground">No active elections at the moment</p>
                  )}
                  {user && !searchTerm && (
                    <Link to="/create-election" className="mt-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Create an Election
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredActive.map((election) => (
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
                        {user && userVotes.some(vote => vote.electionId === election.id && vote.userId === user?.id) && (
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
              </div>
            )}
          </TabsContent>
          <TabsContent value="ended" className="mt-6">
            {filteredEnded.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                  {searchTerm ? (
                    <p className="text-muted-foreground">No ended elections found matching "{searchTerm}"</p>
                  ) : (
                    <p className="text-muted-foreground">No ended elections</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEnded.map((election) => (
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
                          <span className="text-muted-foreground">Ended</span>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            Results available
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Elections;
