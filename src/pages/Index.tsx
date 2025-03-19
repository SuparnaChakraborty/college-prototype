import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { ArrowRight, BookOpen, Users, Calendar, CheckCircle2, FileJson } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Course Matching <span className="text-primary">Made Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Efficiently match students to courses based on preferences, room availability, and lecturer constraints. Optimize your academic scheduling with our powerful matching algorithm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/matcher">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/data-validation">
                    <FileJson className="mr-2 h-5 w-5" />
                    Validate Data
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary/5 border border-primary/10 rounded-xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-background rounded-lg p-4 border">
                  <h3 className="font-medium mb-2">Course Matching Process</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Import student preferences and course data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Validate data for consistency and completeness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <span>Run the matching algorithm with constraints</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                      <span>Review results and optimize if needed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                      <span>Export final assignments for implementation</span>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-background rounded-lg p-4 border">
                  <h3 className="font-medium mb-2">Current Dataset</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>8 Students</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>8 Courses</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>6 Periods</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>Ready to Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our course matching system provides powerful tools to optimize academic scheduling
                while respecting constraints and maximizing student satisfaction.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-background border rounded-xl p-6 shadow-sm"
                >
                  <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Start by exploring the sample dataset or import your own data to see how our matching algorithm can help optimize your course scheduling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/matcher">
                  Run Course Matcher
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/courses">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Courses
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

// Feature data
const features = [
  {
    title: "Preference-Based Matching",
    description: "Match students to courses based on their preferences while respecting capacity constraints and scheduling requirements.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Constraint Satisfaction",
    description: "Handle complex constraints including room capacity, lecturer availability, and period restrictions.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: "Data Validation",
    description: "Validate your dataset to ensure consistency and identify potential issues before running the matching algorithm.",
    icon: <FileJson className="h-5 w-5" />,
  },
];

export default Index;
