import { useEffect, useState } from "react";
import EmptyLayout from "../layouts/EmptyLayout";
import { reportService } from "../services/reportService";
import { toast } from "react-toastify";
import { z } from "zod";

const ReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.findAll();
        const validatedData = z.array(ReportSchema).parse(data);
        setReports(validatedData);
        toast.success("Reports loaded successfully.");
      } catch (err) {
        setError("Failed to load reports.");
        toast.error("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <EmptyLayout title="Reports">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </ul>
      )}
    </EmptyLayout>
  );
}

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => (
  <li className="p-4 border rounded bg-white shadow-md">
    <p className="font-semibold">{report.title}</p>
    <p className="italic text-gray-600">ID: {report.id}</p>
    <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
    <p>Updated: {new Date(report.updatedAt).toLocaleDateString()}</p>
  </li>
);
