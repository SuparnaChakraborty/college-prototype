
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RequestsTable from '@/components/RequestsTable';
import { studentRequests } from '@/utils/data';

const Requests = () => {
  const [periodFilter, setPeriodFilter] = useState('all');
  
  // Get unique periods for filter
  const periods = Array.from(new Set(studentRequests.map(req => req.period))).sort();
  
  const filteredRequests = studentRequests.filter(request => {
    return periodFilter === 'all' || request.period === periodFilter;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero title="Student Requests" subtitle="View and manage student course preferences" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border bg-card p-6 shadow-sm mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredRequests.length} student requests
              {periodFilter !== 'all' && <span> for period {periodFilter}</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      Period {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => setPeriodFilter('all')}
              >
                Reset
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border bg-card shadow-sm overflow-hidden"
        >
          <RequestsTable requests={filteredRequests} />
        </motion.div>
      </main>
    </div>
  );
};

export default Requests;
