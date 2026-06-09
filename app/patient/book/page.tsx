"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Doctor } from "@/types";
import { FiSearch, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/users/doctors/approved");
        setDoctors(res.data.data || []);
        setFilteredDoctors(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [search, doctors]);

  const handleBook = async () => {
    if (!selectedDoctor) return;
    if (!form.appointmentDate || !form.appointmentTime) {
      setError("Please select date and time");
      return;
    }
    setActionLoading(true);
    setError("");
    try {
      await api.post("/api/appointments", {
        doctorAuthId: selectedDoctor.authId,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        reason: form.reason,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const timeSlots = [
    "09:00:00", "09:30:00", "10:00:00", "10:30:00",
    "11:00:00", "11:30:00", "12:00:00", "12:30:00",
    "14:00:00", "14:30:00", "15:00:00", "15:30:00",
    "16:00:00", "16:30:00",
  ];

  if (loading) {
    return (
      <div>
        <Navbar title="Book Appointment" />
        <div className="p-6 flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <Navbar title="Book Appointment" />
        <div className="p-6 flex items-center justify-center">
          <Card className="border border-border shadow-sm p-8 text-center max-w-md">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">
              Appointment Booked!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your appointment with <strong>{selectedDoctor?.name}</strong> on{" "}
              <strong>{form.appointmentDate}</strong> at{" "}
              <strong>{form.appointmentTime}</strong> has been booked successfully.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSuccess(false);
                  setSelectedDoctor(null);
                  setForm({ appointmentDate: "", appointmentTime: "", reason: "" });
                }}
              >
                Book Another
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
                onClick={() => router.push("/patient/appointments")}
              >
                View Appointments
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Book Appointment" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-primary">Book Appointment</h2>
          <p className="text-muted-foreground">Select a doctor and choose your preferred time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left - Doctor selection */}
          <div className="space-y-4">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary text-lg">Select Doctor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Search */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or speciality..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>

                {/* Doctor list */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredDoctors.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">
                      No doctors found
                    </p>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedDoctor?.id === doctor.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-primary">Dr. {doctor.name}</p>
                            <p className="text-muted-foreground text-sm">{doctor.speciality}</p>
                            <p className="text-muted-foreground text-xs">
                              {doctor.experience} years experience
                            </p>
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <Badge className="bg-accent/10 text-accent">Selected</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Booking form */}
          <div className="space-y-4">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary text-lg">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Selected doctor preview */}
                {selectedDoctor ? (
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-primary">Dr. {selectedDoctor.name}</p>
                        <p className="text-muted-foreground text-sm">{selectedDoctor.speciality}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-border text-center">
                    <FiUser className="mx-auto text-muted-foreground text-2xl mb-2" />
                    <p className="text-muted-foreground text-sm">Select a doctor first</p>
                  </div>
                )}

                {/* Date */}
                <FieldGroup>
                  <Field>
                    <FieldLabel>Appointment Date</FieldLabel>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                      <Input
                        type="date"
                        value={form.appointmentDate}
                        onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                        className="pl-10 h-11"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </Field>

                  {/* Time slots */}
                  <Field>
                    <FieldLabel>Select Time Slot</FieldLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setForm({ ...form, appointmentTime: slot })}
                          className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${
                            form.appointmentTime === slot
                              ? "bg-accent text-white border-accent"
                              : "bg-background text-foreground border-border hover:border-accent/50"
                          }`}
                        >
                          {slot.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Reason */}
                  <Field>
                    <FieldLabel>
                      Reason <span className="text-muted-foreground text-xs">(optional)</span>
                    </FieldLabel>
                    <textarea
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="w-full h-24 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:border-accent"
                    />
                  </Field>
                </FieldGroup>

                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleBook}
                  disabled={actionLoading || !selectedDoctor}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white text-base font-medium"
                >
                  {actionLoading ? "Booking..." : "Book Appointment"}
                </Button>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}