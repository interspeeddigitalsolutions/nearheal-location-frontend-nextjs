import React from "react";
import { Job } from "@/types/types";
import JobCard from "../job/JobCard";

interface JobsSectionProps {
  jobs: Job[];
  locationId: string;
}

const JobsSection: React.FC<JobsSectionProps> = ({ jobs, locationId }) => {
  if (jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Jobs</h2>
        <p className="text-muted-foreground">No jobs available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Jobs</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} locationId={locationId}/>
        ))}
      </div>
    </section>
  );
};

export default JobsSection;
