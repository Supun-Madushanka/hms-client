"use client";

import Navbar from "@/components/shared/navbar";
import api from "@/lib/api";
import { Patient } from "@/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiX, FiSave } from "react-icons/fi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PatientProfilePage() {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
    })

    const fetchProfile = async () => {
        try {
            const res = await api.get("/api/users/patients/me");
            setPatient(res.data.data);
            setForm({
                name: res.data.data.name || "",
                phone: res.data.data.phone || "",
                dateOfBirth: res.data.data.dateOfBirth || "",
                gender: res.data.data.gender || "",
                address: res.data.data.address || "",
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
            await api.put("/api/users/patients/me", form);
            setSuccess("Profile updated successfully!");
            setEditing(false);
            fetchProfile();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setActionLoading(false);
        }
    };

    const hasChanges =
        form.name !== patient?.name ||
        form.phone !== patient?.phone ||
        form.dateOfBirth !== patient?.dateOfBirth ||
        form.gender !== patient?.gender ||
        form.address !== patient?.address;
    
    if (loading) {
        return (
            <div>
                <Navbar title="My Profile" />
                <div className="p-6 flex items-center justify-center h-96">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
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
                            className="gap-2"
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
                                {patient?.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold text-primary">{patient?.name}</h3>
                            <p className="text-muted-foreground">{patient?.email}</p>
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
                                    <FieldLabel>Phone</FieldLabel>
                                    <Input
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="h-11"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Date of Birth</FieldLabel>
                                    <Input
                                        type="date"
                                        value={form.dateOfBirth}
                                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                                        className="h-11"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Gender</FieldLabel>
                                    <Select
                                        value={form.gender}
                                        onValueChange={(value) => setForm({ ...form, gender: value })}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Address</FieldLabel>
                                    <Input
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                                <p className="text-foreground font-medium">{patient?.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Email</p>
                                <p className="text-foreground font-medium">{patient?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Phone</p>
                                <p className="text-foreground font-medium">{patient?.phone}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Date of Birth</p>
                                <p className="text-foreground font-medium">{patient?.dateOfBirth}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Gender</p>
                                <p className="text-foreground font-medium">{patient?.gender}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Address</p>
                                <p className="text-foreground font-medium">{patient?.address}</p>
                            </div>
                        </div>
                    )}
            </CardContent>
        </Card>
        </div>
    </div>
  )
}
