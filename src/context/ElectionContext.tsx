
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Election, Option, Vote } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ElectionContextType {
  elections: Election[];
  userVotes: Vote[];
  isLoading: boolean;
  createElection: (title: string, description: string, options: string[], endDate: Date) => void;
  castVote: (electionId: string, optionId: string) => void;
  hasUserVoted: (electionId: string) => boolean;
  getElection: (id: string) => Election | undefined;
  getUserVoteForElection: (electionId: string) => Vote | undefined;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

export const ElectionProvider = ({ children }: { children: ReactNode }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load mock data
  useEffect(() => {
    const savedElections = localStorage.getItem('elections');
    const savedVotes = localStorage.getItem('votes');
    
    if (savedElections) {
      try {
        const parsedElections = JSON.parse(savedElections);
        // Convert string dates back to Date objects
        const electionsWithDates = parsedElections.map((election: any) => ({
          ...election,
          createdAt: new Date(election.createdAt),
          endDate: new Date(election.endDate)
        }));
        setElections(electionsWithDates);
      } catch (error) {
        console.error('Failed to parse stored elections');
      }
    } else {
      // Default mock data if nothing is stored
      const mockElections: Election[] = [
        {
          id: '1',
          title: 'Best Programming Language',
          description: 'Vote for your favorite programming language',
          createdBy: 'system',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          endDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
          options: [
            { id: '1-1', text: 'JavaScript', votes: 5 },
            { id: '1-2', text: 'Python', votes: 7 },
            { id: '1-3', text: 'Java', votes: 3 },
            { id: '1-4', text: 'C#', votes: 2 },
          ],
          status: 'active'
        },
        {
          id: '2',
          title: 'Favorite Frontend Framework',
          description: 'Which frontend framework do you prefer?',
          createdBy: 'system',
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
          endDate: new Date(Date.now() - 86400000), // Ended yesterday
          options: [
            { id: '2-1', text: 'React', votes: 10 },
            { id: '2-2', text: 'Vue', votes: 8 },
            { id: '2-3', text: 'Angular', votes: 4 },
            { id: '2-4', text: 'Svelte', votes: 6 },
          ],
          status: 'ended'
        }
      ];
      
      setElections(mockElections);
      localStorage.setItem('elections', JSON.stringify(mockElections));
    }

    if (savedVotes) {
      try {
        const parsedVotes = JSON.parse(savedVotes);
        // Convert string dates back to Date objects
        const votesWithDates = parsedVotes.map((vote: any) => ({
          ...vote,
          timestamp: new Date(vote.timestamp)
        }));
        setUserVotes(votesWithDates);
      } catch (error) {
        console.error('Failed to parse stored votes');
      }
    }

    setIsLoading(false);
  }, []);

  const saveElections = (updatedElections: Election[]) => {
    setElections(updatedElections);
    localStorage.setItem('elections', JSON.stringify(updatedElections));
  };

  const saveVotes = (updatedVotes: Vote[]) => {
    setUserVotes(updatedVotes);
    localStorage.setItem('votes', JSON.stringify(updatedVotes));
  };

  const createElection = (title: string, description: string, optionTexts: string[], endDate: Date) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to create an election",
        variant: "destructive",
      });
      return;
    }

    const options: Option[] = optionTexts.map((text, index) => ({
      id: Math.random().toString(36).substring(2, 9),
      text,
      votes: 0
    }));

    const newElection: Election = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      description,
      createdBy: user.id,
      createdAt: new Date(),
      endDate,
      options,
      status: 'active'
    };

    const updatedElections = [...elections, newElection];
    saveElections(updatedElections);

    toast({
      title: "Election Created",
      description: "Your election has been successfully created",
      variant: "default",
    });
  };

  const castVote = (electionId: string, optionId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to vote",
        variant: "destructive",
      });
      return;
    }

    // Check if user already voted
    if (hasUserVoted(electionId)) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election",
        variant: "destructive",
      });
      return;
    }

    // Find the election
    const electionIndex = elections.findIndex(e => e.id === electionId);
    if (electionIndex === -1) {
      toast({
        title: "Error",
        description: "Election not found",
        variant: "destructive",
      });
      return;
    }

    const election = elections[electionIndex];
    
    // Check if election is still active
    if (election.status !== 'active' || new Date() > election.endDate) {
      toast({
        title: "Voting Closed",
        description: "This election has ended",
        variant: "destructive",
      });
      return;
    }

    // Find the option
    const optionIndex = election.options.findIndex(o => o.id === optionId);
    if (optionIndex === -1) {
      toast({
        title: "Error",
        description: "Option not found",
        variant: "destructive",
      });
      return;
    }

    // Update election
    const updatedElections = [...elections];
    updatedElections[electionIndex].options[optionIndex].votes += 1;
    saveElections(updatedElections);

    // Record user's vote
    const newVote: Vote = {
      userId: user.id,
      electionId,
      optionId,
      timestamp: new Date()
    };

    const updatedVotes = [...userVotes, newVote];
    saveVotes(updatedVotes);

    toast({
      title: "Vote Cast",
      description: "Your vote has been successfully recorded",
      variant: "default",
    });
  };

  const hasUserVoted = (electionId: string): boolean => {
    if (!user) return false;
    return userVotes.some(vote => vote.electionId === electionId && vote.userId === user.id);
  };

  const getElection = (id: string): Election | undefined => {
    const election = elections.find(e => e.id === id);
    
    // Check if election has ended but status is still active
    if (election && election.status === 'active' && new Date() > election.endDate) {
      // Update status to ended
      const updatedElections = elections.map(e => 
        e.id === id ? { ...e, status: 'ended' } : e
      );
      saveElections(updatedElections);
      return { ...election, status: 'ended' };
    }
    
    return election;
  };

  const getUserVoteForElection = (electionId: string): Vote | undefined => {
    if (!user) return undefined;
    return userVotes.find(vote => vote.electionId === electionId && vote.userId === user.id);
  };

  // Check for elections that have ended but still marked active
  useEffect(() => {
    const now = new Date();
    const needsUpdate = elections.some(e => e.status === 'active' && now > e.endDate);
    
    if (needsUpdate) {
      const updatedElections = elections.map(e => 
        e.status === 'active' && now > e.endDate
          ? { ...e, status: 'ended' }
          : e
      );
      saveElections(updatedElections);
    }
  }, [elections]);

  return (
    <ElectionContext.Provider 
      value={{ 
        elections, 
        userVotes, 
        isLoading, 
        createElection, 
        castVote, 
        hasUserVoted,
        getElection,
        getUserVoteForElection
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};
