
import React from 'react';
import Navbar from '@/components/Navbar';
import DataValidator from '@/components/DataValidator';

const DataValidation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Data Validation & Analysis</h1>
        <p className="text-muted-foreground mb-6">
          Validate the dataset, run analysis, and export clean JSON for the course matcher.
        </p>
        <DataValidator />
      </main>
    </div>
  );
};

export default DataValidation;
