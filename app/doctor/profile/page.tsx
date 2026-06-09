"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Doctor } from "@/types";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    speciality: "",
    experience: 0,
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/doctors/me");
      setDoctor(res.data.data);
      setForm({
        name: res.data.data.name || "",
        phone: res.data.data.phone || "",
        speciality: res.data.data.speciality || "",
        experience: res.data.data.experience || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/api/users/doctors/me", form);
      setSuccess("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case "APPROVED": return <Badge className="bg-green-500/10 text-green-500">Approved</Badge>;
      case "PENDING": return <Badge className="bg-orange-500/10 text-orange-500">Pending</Badge>;
      case "REJECTED": return <Badge className="bg-red-500/10 text-red-500">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const hasChanges = 
    form.name !== doctor?.name ||
    form.phone !== doctor?.phone ||
    form.speciality !== doctor?.speciality ||
    form.experience !== doctor?.experience;

  if (loading) {
    return (
      <div>
        <Navbar title="My Profile" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="My Profile" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-primary">My Profile</h2>
          <p className="text-muted-foreground">View and update your professional details</p>
        </div>

        {/* Success/Error */}
        {success && (
          <div className="bg-green-500/10 text-green-500 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Profile card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary">Profile Information</CardTitle>
              {!editing ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="gap-2"
                >
                  <FiEdit2 /> Edit
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(false)}
                  className="gap-2 text-muted-foreground"
                >
                  <FiX /> Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">

            {/* Avatar section */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {doctor?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-primary">{doctor?.name}</h3>
                <p className="text-muted-foreground">{doctor?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-accent/10 text-accent">Doctor</Badge>
                  {doctor && getApprovalBadge(doctor.approvalStatus)}
                </div>
              </div>
            </div>

            {/* Form */}
            {editing ? (
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-11"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-11"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Speciality</FieldLabel>
                    <Input
                      value={form.speciality}
                      onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                      className="h-11"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Experience (years)</FieldLabel>
                    <Input
                      type="number"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                      className="h-11"
                    />
                  </Field>
                </div>
                <Button
                  onClick={handleUpdate}
                  disabled={actionLoading || !hasChanges}
                  className="bg-accent hover:bg-accent/90 text-white gap-2 mt-2"
                >
                  <FiSave />
                  {actionLoading ? "Saving..." : "Save Changes"}
                </Button>
              </FieldGroup>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Full Name</p>
                  <p className="text-foreground font-medium">{doctor?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Phone Number</p>
                  <p className="text-foreground font-medium">{doctor?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Speciality</p>
                  <p className="text-foreground font-medium">{doctor?.speciality}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Experience</p>
                  <p className="text-foreground font-medium">{doctor?.experience} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">License Number</p>
                  <p className="text-foreground font-medium">{doctor?.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Email</p>
                  <p className="text-foreground font-medium">{doctor?.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}