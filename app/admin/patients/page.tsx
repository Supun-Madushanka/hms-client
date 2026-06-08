"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { Patient } from "@/types";
import { FiMoreVertical, FiTrash2, FiUserCheck, FiUserX, FiEye } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientProfileModal } from "@/components/admin/patient-profile-modal";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/api/users/patients");
      setPatients(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async () => {
    if (!selectedPatient) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/users/patients/${selectedPatient.id}`);
      setDeleteDialog(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewProfile = async (patient: Patient) => {
    try {
        const res = await api.get(`/api/users/patients/${patient.id}`);
        setSelectedPatient(res.data.data);
        setProfileDialog(true);
    } catch (err) {
        console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar title="Patients" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Patients" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">All Patients</h2>
            <p className="text-muted-foreground">Manage and monitor all registered patients</p>
          </div>
          <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl font-medium text-sm">
            Total: {patients.length}
          </div>
        </div>

        {/* Patients list */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-0">
            {patients.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No patients registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {patients.map((patient) => (
                        <TableRow key={patient.id}>
                        <TableCell>
                            {patient.name || "—"}
                        </TableCell>

                        <TableCell>
                            {patient.email || "—"}
                        </TableCell>

                        <TableCell>
                            {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "—"}
                        </TableCell>

                        <TableCell>
                            {patient.phone || "—"}
                        </TableCell>

                        <TableCell>
                            {patient.gender || "—"}
                        </TableCell>

                        <TableCell>
                            {patient.address || "—"}
                        </TableCell>

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

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                    onClick={() => handleViewProfile(patient)}
                                >
                                    <FiEye className="text-accent" />
                                    View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                onClick={() => {
                                    setSelectedPatient(patient);
                                    setDeleteDialog(true);
                                }}
                                className="gap-2 text-destructive focus:text-destructive"
                                >
                                <FiTrash2 />
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Delete Patient</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete <strong>{selectedPatient?.name}</strong>?
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
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile modal */}
      <PatientProfileModal
        open={profileDialog}
        onOpenChange={setProfileDialog}
        patient={selectedPatient}
      />

    </div>
  );
}