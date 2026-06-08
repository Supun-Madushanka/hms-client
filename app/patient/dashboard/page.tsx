import Navbar from "@/components/shared/navbar";

export default function PatientDashboard() {
  return (
    <div>
      <Navbar title="Patient Dashboard" />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Welcome Patient!</h2>
      </div>
    </div>
  );
}