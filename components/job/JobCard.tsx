import React from "react";
import { Job } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
// import { useRouter } from "next/router";

interface JobCardProps {
  job: Job;
  locationId: string;
}

const JobCard: React.FC<JobCardProps> = ({ job, locationId }) => {
  // const router = useRouter();

  // Navigate to job detail page on card click
  const handleCardClick = (jobId: string) => {
    // router.push(`/jobs/${jobId}`);
    window.location.href = `${process.env.NEXT_PUBLIC_JOB_FRONTEND_URL}/${locationId}/jobs/${jobId}`;
  };

  return (
    <Card
      onClick={() => handleCardClick(job._id)}
      className="rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all border p-4 flex flex-col justify-between"
    >
      {/* Thumbnail */}
      {job.thumbnail?.path && (
        <div className="w-full h-40 relative mb-3 rounded-lg overflow-hidden">
          <Image
            src={`https://cdn.reel-recruits.com/${job.thumbnail.path}`}
            alt={job.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Title + Short Description */}
      <CardContent className="p-0 flex flex-col gap-2">
        <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.shortDescription || "No description available."}
        </p>

        {/* Salary Range */}
        {(job.salaryRangeMin || job.salaryRangeMax) && (
          <p className="text-sm font-medium text-primary mt-2">
            ${job.salaryRangeMin} - ${job.salaryRangeMax}
          </p>
        )}

        {/* Job Type + Location */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {job.jobRoleType}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {job.jobLocationType}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
