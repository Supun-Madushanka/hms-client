"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { API_ROUTES, APP_ROUTES } from "@/constants";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PatientForm = z.infer<typeof patientSchema>;

export default function PatientRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dateOfBirth: "",
      address: "",
    },
  });

  const onSubmit = async (data: PatientForm) => {
    setLoading(true);
    setError("");
    try {
      const { confirmPassword, ...submitData } = data;
      await api.post(API_ROUTES.REGISTER_PATIENT, submitData);
      router.push(APP_ROUTES.LOGIN);
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
            Join as Patient
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your account and start booking appointments with verified doctors today.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { icon: "📅", title: "Book Appointments", sub: "Schedule with top doctors" },
              { icon: "📋", title: "Health Records", sub: "Track your medical history" },
              { icon: "🔔", title: "Get Reminders", sub: "Never miss an appointment" },
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

          <Card className="border shadow-sm rounded-2xl p-8">
            <CardHeader className="px-0">
              <CardTitle className="text-3xl font-bold text-primary">
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form id="patient-register-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="pl-10 h-12"
                          />
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
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            className="pl-10 h-12"
                          />
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
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Phone Number <span className="text-muted-foreground text-xs">(optional)</span></FieldLabel>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                          <Input
                            {...field}
                            placeholder="0771234567"
                            className="pl-10 h-12"
                          />
                        </div>
                      </Field>
                    )}
                  />

                  {/* Date of Birth & Gender - side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="dateOfBirth"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Date of Birth <span className="text-muted-foreground text-xs">(optional)</span></FieldLabel>
                          <Input
                            {...field}
                            type="date"
                            className="h-12"
                          />
                        </Field>
                      )}
                    />

                    <Controller
                      name="gender"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Gender <span className="text-muted-foreground text-xs">(optional)</span></FieldLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Address <span className="text-muted-foreground text-xs">(optional)</span></FieldLabel>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                          <Input
                            {...field}
                            placeholder="Colombo, Sri Lanka"
                            className="pl-10 h-12"
                          />
                        </div>
                      </Field>
                    )}
                  />

                </FieldGroup>
              </form>

              <div className="mt-5 space-y-4">
                <Button
                  type="submit"
                  form="patient-register-form"
                  disabled={loading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white text-base font-medium"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center space-y-2 pt-2">
                  <p className="text-muted-foreground text-sm">
                    Already have an account?{" "}
                    <Link href={APP_ROUTES.LOGIN} className="text-accent hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Are you a doctor?{" "}
                    <Link href={APP_ROUTES.REGISTER_DOCTOR} className="text-accent hover:underline font-medium">
                      Register as Doctor
                    </Link>
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}