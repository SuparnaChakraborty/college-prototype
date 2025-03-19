
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Course Catalog',
      description: 'Browse all available courses with detailed information about lecturers and capacity requirements.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      path: '/courses'
    },
    {
      title: 'Student Requests',
      description: 'View and manage student course preferences and scheduling requests.',
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      path: '/requests'
    },
    {
      title: 'Matching Algorithm',
      description: 'Visualize how our advanced matching algorithm optimizes student satisfaction and resource allocation.',
      icon: PieChart,
      color: 'bg-green-50 text-green-600',
      path: '/matcher'
    },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero
        title={
          <span>
            <span className="text-primary">Course</span>
            <span>Matcher</span>
          </span>
        }
        subtitle="Optimizing course assignments for students and faculty with an intelligent matching algorithm."
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Features section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 grid gap-8 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative p-6 rounded-xl border bg-card shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-70" />
              
              <div className="relative">
                <div className={cn("p-2 w-12 h-12 rounded-lg flex items-center justify-center mb-4", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                <Button 
                  variant="outline" 
                  className="mt-auto group"
                  onClick={() => navigate(feature.path)}
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Testimonial/Stat section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 glass rounded-xl p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Optimizing Educational Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">95%</p>
                <p className="mt-2 text-muted-foreground">Student Preferences Satisfied</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">100%</p>
                <p className="mt-2 text-muted-foreground">Faculty Resource Optimization</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">30%</p>
                <p className="mt-2 text-muted-foreground">Less Administrative Time</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
