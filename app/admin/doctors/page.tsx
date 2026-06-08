"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Doctor } from "@/types";
import { FiMoreVertical, FiCheck, FiX, FiTrash2, FiUserCheck, FiUserX, FiEye } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DoctorProfileModal } from "@/components/admin/doctor-profile-modal";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/users/doctors");
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (doctor: Doctor) => {
    setActionLoading(true);
    try {
      await api.put(`/api/users/doctors/approval/${doctor.id}`, {
        approvalStatus: "APPROVED",
      });
      fetchDoctors();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doctor: Doctor) => {
    setActionLoading(true);
    try {
      await api.put(`/api/users/doctors/approval/${doctor.id}`, {
        approvalStatus: "REJECTED",
      });
      fetchDoctors();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoctor) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/users/doctors/${selectedDoctor.id}`);
      setDeleteDialog(false);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async (doctor: Doctor) => {
    setActionLoading(true);
    try {
      const newStatus = doctor.approvalStatus === "APPROVED" ? "REJECTED" : "APPROVED";
      await api.put(`/api/users/doctors/approval/${doctor.id}`, {
        approvalStatus: newStatus,
      });
      fetchDoctors();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-500";
      case "PENDING":
        return "bg-orange-500/10 text-orange-500";
      case "REJECTED":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handleViewProfile = async (doctor: Doctor) => {
    try {
      const res = await api.get(`/api/users/doctors/${doctor.id}`);
      setSelectedDoctor(res.data.data);
      setProfileDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar title="Doctors" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Doctors" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">All Doctors</h2>
            <p className="text-muted-foreground">Manage and monitor all registered doctors</p>
          </div>
          <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl font-medium text-sm">
            Total: {doctors.length}
          </div>
        </div>

        {/* Doctors list */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-0">
            {doctors.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No doctors registered yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Speciality</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        {doctor.name}
                      </TableCell>

                      <TableCell>{doctor.email}</TableCell>

                      <TableCell>{doctor.speciality}</TableCell>

                      <TableCell>
                        {doctor.experience} years
                      </TableCell>

                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getApprovalBadge(
                            doctor.approvalStatus
                          )}`}
                        >
                          {doctor.approvalStatus}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {doctor.approvalStatus === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(doctor)}
                                disabled={actionLoading}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <FiCheck className="mr-1" />
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => handleReject(doctor)}
                                disabled={actionLoading}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                <FiX className="mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <FiMoreVertical />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewProfile(doctor)}
                              >
                                <FiEye className="text-accent" />
                                View Profile
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(doctor)}
                              >
                                {doctor.approvalStatus === "APPROVED" ? (
                                  <>
                                    <FiUserX className="text-orange-500" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <FiUserCheck className="text-green-500" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setDeleteDialog(true);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <FiTrash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Delete Doctor</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete <strong>{selectedDoctor?.name}</strong>?
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

      {/* Profile dialog */}
      <DoctorProfileModal
        open={profileDialog}
        onOpenChange={setProfileDialog}
        doctor={selectedDoctor}
      />

    </div>
  );
}