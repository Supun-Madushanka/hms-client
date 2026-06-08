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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { FiEdit2 } from "react-icons/fi";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
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

  const handleUpdateStatus = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await api.put(`/api/appointments/${selectedAppointment.id}/status`, {
        status: newStatus,
        notes: notes,
      });
      setStatusDialog(false);
      setSelectedAppointment(null);
      setNotes("");
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

  const filters = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

  const filteredAppointments = filter === "ALL"
    ? appointments
    : appointments.filter((apt) => apt.status === filter);

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
            <p className="text-muted-foreground">Manage your patient appointments</p>
          </div>
          <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl font-medium text-sm">
            Total: {appointments.length}
          </div>
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
                  <TableHead className="text-muted-foreground">#</TableHead>
                  <TableHead className="text-muted-foreground">Patient</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-muted-foreground">Notes</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
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
                        {apt.patientName}
                      </TableCell>
                      <TableCell className="text-sm">{apt.appointmentDate}</TableCell>
                      <TableCell className="text-sm">{apt.appointmentTime}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {apt.reason || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {apt.notes || "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setNewStatus(apt.status);
                            setNotes(apt.notes || "");
                            setStatusDialog(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <FiEdit2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      {/* Update status dialog */}
      <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Update Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Status</p>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for patient..."
                className="w-full h-24 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={actionLoading}
              className="bg-accent hover:bg-accent/90 text-white"
            >
              {actionLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}