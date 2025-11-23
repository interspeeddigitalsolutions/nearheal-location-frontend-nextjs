import React from "react";
import { Job } from "@/types/types";
import JobCard from "../job/JobCard";

interface JobsSectionProps {
  jobs: Job[];
  locationId: string;
}

const JobsSection: React.FC<JobsSectionProps> = ({ jobs, locationId }) => {
  if (jobs.length === 0) {
    return '';
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col mb-10">
        <div className="text-[#e5b45b] font-medium mb-4">
          — CAREER OPPORTUNITIES
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-4xl font-bold mb-2">
            Join Our Team{" "}
            <span className="text-[#e5b45b] font-serif italic">
              and Grow With Us
            </span>
          </h2>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} locationId={locationId} />
        ))}
      </div>
    </section>
  );
};

export default JobsSection;
