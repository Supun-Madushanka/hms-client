import Navbar from "@/components/shared/navbar";

export default function AdminDashboard() {
  return (
    <div>
      <Navbar title="Admin Dashboard" />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Welcome Admin!</h2>
      </div>
    </div>
  );
}