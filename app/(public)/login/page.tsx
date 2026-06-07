"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/api/auth/login", data);
      const { data: userData } = response.data;
      setAuth(userData, userData.token);
      if (userData.role === "ADMIN") router.push("/admin/dashboard");
      else if (userData.role === "DOCTOR") router.push("/doctor/dashboard");
      else router.push("/patient/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left side - decorative */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12">
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
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Login to access your dashboard and manage your healthcare journey.
          </p>
          <div className="mt-12 space-y-4">
            {[
              { icon: "👨‍⚕️", title: "20+ Verified Doctors", sub: "Ready to help you" },
              { icon: "📅", title: "Easy Appointment Booking", sub: "Book in just a few clicks" },
              { icon: "🔒", title: "Secure & Private", sub: "Your data is protected" },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white">{item.icon}</span>
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

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

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
              <CardTitle className="text-3xl font-bold text-primary">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>

                  {error && (
                    <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email */}
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="login-email">Email Address</FieldLabel>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                          <Input
                            {...field}
                            id="login-email"
                            placeholder="you@example.com"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 h-12 border-border focus:border-accent"
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Password */}
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="login-password">Password</FieldLabel>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                          <Input
                            {...field}
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            aria-invalid={fieldState.invalid}
                            className="pl-10 pr-10 h-12 border-border focus:border-accent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                </FieldGroup>
              </form>

              {/* Submit + links outside FieldGroup */}
              <div className="mt-5 space-y-4">
                <Button
                  type="submit"
                  form="login-form"
                  disabled={loading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white text-base font-medium"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center space-y-2 pt-2">
                  <p className="text-muted-foreground text-sm">Don't have an account?</p>
                  <div className="flex justify-center gap-4">
                    <Link href="/register/patient" className="text-accent hover:underline text-sm font-medium">
                      Register as Patient
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/register/doctor" className="text-accent hover:underline text-sm font-medium">
                      Register as Doctor
                    </Link>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}