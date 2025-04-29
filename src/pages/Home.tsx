
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Vote, CheckCircle, BarChart3, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Create Elections',
      description: 'Create custom elections with multiple options in just a few clicks.',
      icon: <Vote className="h-10 w-10 text-vote-blue p-2 bg-blue-50 rounded-lg" />,
    },
    {
      title: 'Secure Voting',
      description: 'Every user can vote only once per election, ensuring fair results.',
      icon: <Shield className="h-10 w-10 text-vote-purple p-2 bg-purple-50 rounded-lg" />,
    },
    {
      title: 'Real-time Results',
      description: 'View real-time voting results as they come in.',
      icon: <BarChart3 className="h-10 w-10 text-vote-green p-2 bg-green-50 rounded-lg" />,
    },
    {
      title: 'Simple Management',
      description: 'Manage all your elections from a central dashboard.',
      icon: <CheckCircle className="h-10 w-10 text-vote-blue p-2 bg-blue-50 rounded-lg" />,
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Vote className="h-16 w-16 text-vote-blue" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent vote-gradient">
            Online Voting Made Simple
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Create, manage, and participate in elections with our secure and easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="text-lg px-6 py-6 bg-vote-blue hover:bg-vote-blue/90">
                Get Started
              </Button>
            </Link>
            <Link to="/elections">
              <Button variant="outline" className="text-lg px-6 py-6">
                Explore Elections
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Successful Elections
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your First Election?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of users who already trust Vote Central for their voting needs.
          </p>
          <Link to="/signup">
            <Button className="text-lg px-6 py-6 bg-vote-purple hover:bg-vote-purple/90">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
