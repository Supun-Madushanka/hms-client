"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiAward, FiFileText } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import api from "@/lib/api";
import { API_ROUTES, APP_ROUTES } from "@/constants";

const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  speciality: z.string().min(2, "Speciality is required"),
  licenseNumber: z.string().min(2, "License number is required"),
  experience: z.number({ error: "Experience must be a number" }).min(0, "Experience must be at least 0"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type DoctorForm = z.infer<typeof doctorSchema>;

export default function DoctorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<DoctorForm>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      speciality: "",
      licenseNumber: "",
      experience: 0,
    },
  });

  const onSubmit = async (data: DoctorForm) => {
    setLoading(true);
    setError("");
    try {
      const { confirmPassword, ...submitData } = data;
      await api.post(API_ROUTES.REGISTER_DOCTOR, submitData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left side - decorative */}
      <div className="hidden lg:flex w-2/5 bg-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <span className="text-white text-xl font-bold">HMS</span>
            <p className="text-accent text-xs">Hospital Management System</p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Join as Doctor
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Register and connect with patients. Your application will be reviewed by our admin team.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { icon: "👥", title: "Connect with Patients", sub: "Manage your appointments" },
              { icon: "✅", title: "Verified Platform", sub: "Trusted by thousands" },
              { icon: "📊", title: "Track Your Practice", sub: "Monitor your appointments" },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span>{item.icon}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-white/60 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Approval notice */}
          <div className="mt-8 bg-accent/20 rounded-2xl p-4 border border-accent/30">
            <p className="text-accent font-medium text-sm mb-1">⏳ Approval Required</p>
            <p className="text-white/70 text-sm">
              Your account will be reviewed by our admin team before you can start accepting patients.
            </p>
          </div>
        </div>

        <p className="text-white/40 text-sm">© 2026 HMS. All rights reserved.</p>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <span className="text-primary text-xl font-bold">HMS</span>
              <p className="text-accent text-xs">Hospital Management System</p>
            </div>
          </div>

          {/* Success state */}
          {success ? (
            <Card className="border shadow-sm rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Registration Successful!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your application has been submitted. Our admin team will review
                your details and approve your account shortly.
              </p>
              <Button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="bg-accent hover:bg-accent/90 text-white w-full h-12"
              >
                Go to Login
              </Button>
            </Card>
          ) : (

            <Card className="border shadow-sm rounded-2xl p-8">
              <CardHeader className="px-0">
                <CardTitle className="text-3xl font-bold text-primary">
                  Doctor Registration
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill in your professional details to apply
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <form id="doctor-register-form" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>

                    {error && (
                      <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    {/* Name */}
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Full Name</FieldLabel>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input {...field} placeholder="Dr. John Doe" className="pl-10 h-12" />
                          </div>
                          {fieldState.error && (
                            <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                          )}
                        </Field>
                      )}
                    />

                    {/* Email */}
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Email Address</FieldLabel>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input {...field} placeholder="doctor@example.com" className="pl-10 h-12" />
                          </div>
                          {fieldState.error && (
                            <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                          )}
                        </Field>
                      )}
                    />

                    {/* Password */}
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Password</FieldLabel>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                          {fieldState.error && (
                            <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                          )}
                        </Field>
                      )}
                    />

                    {/* Confirm Password */}
                    <Controller
                      name="confirmPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Confirm Password</FieldLabel>
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 h-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                          {fieldState.error && (
                            <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                          )}
                        </Field>
                      )}
                    />

                    {/* Phone */}
                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Phone Number <span className="text-muted-foreground text-xs">(optional)</span></FieldLabel>
                          <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input {...field} placeholder="0771234567" className="pl-10 h-12" />
                          </div>
                        </Field>
                      )}
                    />

                    {/* Speciality */}
                    <Controller
                      name="speciality"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Speciality</FieldLabel>
                          <div className="relative">
                            <FiAward className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input {...field} placeholder="e.g. Cardiology" className="pl-10 h-12" />
                          </div>
                          {fieldState.error && (
                            <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                          )}
                        </Field>
                      )}
                    />

                    {/* License Number & Experience */}
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="licenseNumber"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel>License Number</FieldLabel>
                            <div className="relative">
                              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                              <Input {...field} placeholder="LIC-001" className="pl-10 h-12" />
                            </div>
                            {fieldState.error && (
                              <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="experience"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel>Experience (years)</FieldLabel>
                            <Input
                              type="number"
                              placeholder="5"
                              className="h-12"
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            {fieldState.error && (
                              <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                  </FieldGroup>
                </form>

                <div className="mt-5 space-y-4">
                  <Button
                    type="submit"
                    form="doctor-register-form"
                    disabled={loading}
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-white text-base font-medium"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>

                  <div className="text-center space-y-2 pt-2">
                    <p className="text-muted-foreground text-sm">
                      Already have an account?{" "}
                      <Link href={APP_ROUTES.LOGIN} className="text-accent hover:underline font-medium">
                        Sign In
                      </Link>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Are you a patient?{" "}
                      <Link href={APP_ROUTES.REGISTER_PATIENT} className="text-accent hover:underline font-medium">
                        Register as Patient
                      </Link>
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}