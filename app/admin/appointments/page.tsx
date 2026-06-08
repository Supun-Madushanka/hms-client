"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { FiCalendar, FiClock, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments");
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

  const deleteAppointment = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/appointments/${selectedAppointment.id}`);
      setDeleteDialog(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  const filters = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

  const filteredAppointments = filter === "ALL"
    ? appointments
    : appointments.filter((apt) => apt.status === filter);

  if (loading) {
    return (
      <div>
        <Navbar title="Appointments" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Appointments" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">All Appointments</h2>
            <p className="text-muted-foreground">Monitor all hospital appointments</p>
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

        {/* Appointments list */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-0">
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {filteredAppointments.map((apt) => (
                        <TableRow key={apt.id}>
                        {/* ID */}
                        <TableCell className="font-medium">
                            #{apt.id}
                        </TableCell>

                        {/* Patient */}
                        <TableCell>
                            {apt.patientName}
                        </TableCell>

                        {/* Doctor */}
                        <TableCell>
                            {apt.doctorName}
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                            <div className="flex items-center gap-2">
                            <FiCalendar className="text-muted-foreground" />
                            {apt.appointmentDate}
                            </div>
                        </TableCell>

                        {/* Time */}
                        <TableCell>
                            <div className="flex items-center gap-2">
                            <FiClock className="text-muted-foreground" />
                            {apt.appointmentTime}
                            </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                            <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(
                                apt.status
                            )}`}
                            >
                            {apt.status}
                            </span>
                        </TableCell>

                        {/* Reason */}
                        <TableCell>
                            {apt.reason || "-"}
                        </TableCell>

                        {/* Notes */}
                        <TableCell>
                            {apt.notes || "-"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                  <FiMoreVertical />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedAppointment(apt);
                                        setDeleteDialog(true);
                                      }}
                                      className="gap-2 text-destructive focus:text-white"
                                    >
                                      <FiTrash2/>
                                      Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary"> Delete Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete <strong>{selectedAppointment?.patientName}</strong>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteAppointment}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}