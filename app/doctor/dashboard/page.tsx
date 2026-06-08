import Navbar from "@/components/shared/navbar";

export default function DoctorDashboard() {
  return (
    <div>
      <Navbar title="Doctor Dashboard" />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Welcome Doctor!</h2>
      </div>
    </div>
  );
}