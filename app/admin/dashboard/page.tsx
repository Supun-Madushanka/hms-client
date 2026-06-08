"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Doctor, Patient, Appointment } from "@/types";
import { FiUsers, FiUserCheck, FiCalendar, FiClock } from "react-icons/fi";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, appointmentsRes, pendingRes] = await Promise.all([
          api.get("/api/users/doctors"),
          api.get("/api/users/patients"),
          api.get("/api/appointments"),
          api.get("/api/users/doctors/pending"),
        ]);
        setDoctors(doctorsRes.data.data || []);
        setPatients(patientsRes.data.data || []);
        setAppointments(appointmentsRes.data.data || []);
        setPendingDoctors(pendingRes.data.data || []);
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
      title: "Total Doctors",
      value: doctors.length,
      icon: <FiUserCheck className="text-2xl" />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Patients",
      value: patients.length,
      icon: <FiUsers className="text-2xl" />,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <FiCalendar className="text-2xl" />,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Pending Approvals",
      value: pendingDoctors.length,
      icon: <FiClock className="text-2xl" />,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div>
        <Navbar title="Admin Dashboard" />
        <div className="p-6 flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Admin Dashboard" />
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-primary">Welcome back, Admin!</h2>
          <p className="text-muted-foreground">Here's what's happening in your hospital today.</p>
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

        {/* Recent appointments & Pending doctors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pending Doctors */}
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingDoctors.length === 0 ? (
                <p className="text-muted-foreground text-sm">No pending approvals</p>
              ) : (
                <div className="space-y-3">
                  {pendingDoctors.slice(0, 5).map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                      <div>
                        <p className="font-medium text-primary text-sm">{doctor.name}</p>
                        <p className="text-muted-foreground text-xs">{doctor.speciality}</p>
                      </div>
                      <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-lg">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No appointments yet</p>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                      <div>
                        <p className="font-medium text-primary text-sm">
                          Appointment #{apt.id}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {apt.appointmentDate} at {apt.appointmentTime}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" :
                        apt.status === "PENDING" ? "bg-orange-500/10 text-orange-500" :
                        apt.status === "CANCELLED" ? "bg-red-500/10 text-red-500" :
                        apt.status === "COMPLETED" ? "bg-blue-500/10 text-blue-500" :
                        "bg-gray-500/10 text-gray-500"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}