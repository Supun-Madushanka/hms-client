"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { FiCalendar, FiClock, FiCheckCircle, FiPlusCircle } from "react-icons/fi";
import Link from "next/link";

export default function PatientDashboard() {
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
      case "CONFIRMED": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">{status}</Badge>;
      case "PENDING": return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">{status}</Badge>;
      case "CANCELLED": return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{status}</Badge>;
      case "COMPLETED": return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">{status}</Badge>;
      case "NO_SHOW": return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar title="Patient Dashboard" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Patient Dashboard" />
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Welcome!</h2>
            <p className="text-muted-foreground">Here's your health overview.</p>
          </div>
          <Link href="/patient/book">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
              <FiPlusCircle /> Book Appointment
            </Button>
          </Link>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary text-lg">Recent Appointments</CardTitle>
            <Link href="/patient/appointments">
              <Button variant="ghost" size="sm" className="text-accent">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>#</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      No appointments yet.{" "}
                      <Link href="/patient/book" className="text-accent hover:underline">
                        Book your first appointment!
                      </Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.slice(0, 5).map((apt) => (
                    <TableRow key={apt.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">#{apt.id}</TableCell>
                      <TableCell>
                        {apt.doctorName}
                      </TableCell>
                      <TableCell className="text-sm">{apt.appointmentDate}</TableCell>
                      <TableCell className="text-sm">{apt.appointmentTime}</TableCell>
                      <TableCell className="text-sm">{apt.reason}</TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}