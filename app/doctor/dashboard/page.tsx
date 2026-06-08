"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/appointments/my");
        setAppointments(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <FiCalendar className="text-2xl" />,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Pending",
      value: appointments.filter((a) => a.status === "PENDING").length,
      icon: <FiClock className="text-2xl" />,
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Confirmed",
      value: appointments.filter((a) => a.status === "CONFIRMED").length,
      icon: <FiCheckCircle className="text-2xl" />,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Completed",
      value: appointments.filter((a) => a.status === "COMPLETED").length,
      icon: <FiCheckCircle className="text-2xl" />,
      color: "bg-blue-500/10 text-blue-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-500/10 text-green-500";
      case "PENDING": return "bg-orange-500/10 text-orange-500";
      case "CANCELLED": return "bg-red-500/10 text-red-500";
      case "COMPLETED": return "bg-blue-500/10 text-blue-500";
      case "NO_SHOW": return "bg-gray-500/10 text-gray-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar title="Doctor Dashboard" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Doctor Dashboard" />
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-primary">Welcome, Doctor!</h2>
          <p className="text-muted-foreground">Here's your appointment overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-primary mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent appointments */}
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary text-lg">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No appointments yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {appointments.slice(0, 5).map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>
                          {apt.patientName}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {apt.reason}
                        </TableCell>

                        <TableCell>
                          {apt.appointmentDate}
                        </TableCell>

                        <TableCell>
                          {apt.appointmentTime}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                              apt.status
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}