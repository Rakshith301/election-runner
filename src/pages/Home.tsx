
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Vote, CheckCircle, BarChart3, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Create Elections',
      description: 'Create custom elections with multiple options in just a few clicks.',
      icon: <Vote className="h-10 w-10 text-blue-500 p-2 bg-blue-50 rounded-lg" />,
    },
    {
      title: 'Secure Voting',
      description: 'Every user can vote only once per election, ensuring fair results.',
      icon: <Shield className="h-10 w-10 text-blue-500 p-2 bg-blue-50 rounded-lg" />,
    },
    {
      title: 'Real-time Results',
      description: 'View real-time voting results as they come in.',
      icon: <BarChart3 className="h-10 w-10 text-blue-500 p-2 bg-blue-50 rounded-lg" />,
    },
    {
      title: 'Simple Management',
      description: 'Manage all your elections from a central dashboard.',
      icon: <CheckCircle className="h-10 w-10 text-blue-500 p-2 bg-blue-50 rounded-lg" />,
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
              <Vote className="h-20 w-20 text-blue-500 relative z-10 animate-float" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-600">
            Online Voting Made Simple
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create, manage, and participate in elections with our secure and easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="text-lg px-6 py-6 bg-blue-500 hover:bg-blue-600 text-white">
                Get Started
              </Button>
            </Link>
            <Link to="/elections">
              <Button variant="outline" className="text-lg px-6 py-6 border-blue-500 text-blue-500 hover:bg-blue-50">
                Explore Elections
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 blue-gradient-light rounded-xl mb-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">
            Everything You Need for Successful Elections
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 md:py-24 bg-white rounded-xl border border-blue-100 shadow-md">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">
            Ready to Create Your First Election?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who already trust Vote Central for their voting needs.
          </p>
          <Link to="/signup">
            <Button className="text-lg px-6 py-6 bg-blue-500 hover:bg-blue-600 text-white">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
