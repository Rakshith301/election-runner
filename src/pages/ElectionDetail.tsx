
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useElection } from '@/context/ElectionContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BarChart } from 'recharts';
import { Vote, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ElectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getElection, hasUserVoted, castVote, getUserVoteForElection } = useElection();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  if (!id) {
    navigate('/elections');
    return null;
  }
  
  const election = getElection(id);
  const userVote = getUserVoteForElection(id);
  
  // If election not found, redirect to elections page
  useEffect(() => {
    if (!election) {
      navigate('/elections');
    }
  }, [election, navigate]);
  
  // Calculate time left until election ends
  useEffect(() => {
    if (!election || election.status === 'ended') return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(election.endDate);
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('Election has ended');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''} left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''} left`);
      } else {
        setTimeLeft(`${minutes} minute${minutes > 1 ? 's' : ''} left`);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [election]);
  
  const handleVote = () => {
    if (selectedOption && election) {
      castVote(election.id, selectedOption);
    }
  };
  
  if (!election) return null; // Safety check
  
  const totalVotes = election.options.reduce((acc, option) => acc + option.votes, 0);
  
  const isElectionCreator = user && election.createdBy === user.id;
  const isActive = election.status === 'active';
  const canVote = isActive && user && !hasUserVoted(election.id);
  const showResults = !isActive || hasUserVoted(election.id);
  
  const formatDate = (date: Date) => format(new Date(date), 'MMMM d, yyyy');
  
  const getVotePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{election.title}</h1>
            <p className="text-gray-600">{election.description}</p>
          </div>
          
          <div className="flex items-center">
            {isActive ? (
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Ended</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {canVote ? 'Cast Your Vote' : showResults ? 'Results' : 'Election'}
                </CardTitle>
                {canVote && (
                  <CardDescription>
                    Select one option below to cast your vote
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {canVote ? (
                  <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                    <div className="space-y-3">
                      {election.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 border rounded-md p-4 hover:bg-slate-50 cursor-pointer"
                          onClick={() => setSelectedOption(option.id)}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="w-full cursor-pointer font-medium">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : showResults ? (
                  <div className="space-y-4">
                    {election.options.map((option) => {
                      const percentage = getVotePercentage(option.votes);
                      const isVoted = userVote?.optionId === option.id;
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{option.text}</span>
                              {isVoted && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                  Your vote
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {option.votes} vote{option.votes !== 1 ? 's' : ''} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                isVoted ? 'bg-vote-blue' : 'bg-vote-purple'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-4 pt-4 border-t text-center">
                      <p className="text-muted-foreground">
                        Total votes: {totalVotes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Please log in to vote in this election
                    </p>
                    <Button 
                      onClick={() => navigate('/login')}
                      className="mt-4 bg-vote-blue hover:bg-vote-blue/90"
                    >
                      Log In
                    </Button>
                  </div>
                )}
              </CardContent>
              {canVote && (
                <CardFooter>
                  <Button
                    onClick={handleVote}
                    className="w-full bg-vote-blue hover:bg-vote-blue/90"
                    disabled={!selectedOption}
                  >
                    <Vote className="mr-2 h-4 w-4" />
                    Submit Vote
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Election Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created on</p>
                    <p className="font-medium">{formatDate(election.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">End date</p>
                    <p className="font-medium">{formatDate(election.endDate)}</p>
                    {isActive && (
                      <p className="text-sm text-vote-blue">{timeLeft}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="h-4 w-4 mt-1 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Options</p>
                    <p className="font-medium">{election.options.length} options</p>
                  </div>
                </div>
                
                {isElectionCreator && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                      You created this election
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {hasUserVoted(election.id) && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <div className="bg-vote-blue h-12 w-12 flex items-center justify-center rounded-full mx-auto mb-2">
                        <Vote className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-medium text-blue-800">You've voted in this election</p>
                      <p className="text-sm text-blue-600 mt-1">Thank you for participating!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ElectionDetail;
