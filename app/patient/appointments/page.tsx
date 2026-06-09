"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import Link from "next/link";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments/my");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await api.put(`/api/appointments/${selectedAppointment.id}/cancel`);
      setCancelDialog(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

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

  const filters = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  const filteredAppointments = filter === "ALL"
    ? appointments
    : appointments.filter((apt) => apt.status === filter);

  const canCancel = (status: string) =>
    status === "PENDING" || status === "CONFIRMED";

  if (loading) {
    return (
      <div>
        <Navbar title="My Appointments" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="My Appointments" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">My Appointments</h2>
            <p className="text-muted-foreground">View and manage your appointments</p>
          </div>
          <Link href="/patient/book">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
              <FiPlusCircle /> Book Appointment
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>#</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                      No appointments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">#{apt.id}</TableCell>
                      <TableCell>
                        {apt.doctorName}
                      </TableCell>
                      <TableCell className="text-sm">{apt.appointmentDate}</TableCell>
                      <TableCell className="text-sm">{apt.appointmentTime}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {apt.reason || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                        {apt.notes || "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-right">
                        {canCancel(apt.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setCancelDialog(true);
                            }}
                            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-1"
                          >
                            <FiXCircle /> Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Cancel Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to cancel your appointment on{" "}
            <strong>{selectedAppointment?.appointmentDate}</strong> at{" "}
            <strong>{selectedAppointment?.appointmentTime}</strong> with{" "}
            <strong>Dr. {selectedAppointment?.doctorName}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)}>
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {actionLoading ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}