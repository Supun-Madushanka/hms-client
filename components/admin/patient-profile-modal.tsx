"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/types";

interface PatientProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

export function PatientProfileModal({
  open,
  onOpenChange,
  patient,
}: PatientProfileModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Patient Profile</DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {patient.name}
              </h2>

              <p className="text-muted-foreground">
                {patient.email}
              </p>
            </div>

            <Badge variant="default">
              Patient
            </Badge>
          </div>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 space-y-6">

            <div>
              <h3 className="font-semibold mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="Full Name"
                  value={patient.name || "Not Provided"}
                />

                <InfoCard
                  label="Email"
                  value={patient.email || "Not Provided"}
                />

                <InfoCard
                  label="Phone"
                  value={patient.phone || "Not Provided"}
                />

                <InfoCard
                  label="Gender"
                  value={patient.gender || "Not Provided"}
                />

                <InfoCard
                  label="Date of Birth"
                  value={
                    patient.dateOfBirth
                      ? new Date(
                          patient.dateOfBirth
                        ).toLocaleDateString()
                      : "Not Provided"
                  }
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">
                Address Information
              </h3>

              <InfoCard
                label="Address"
                value={patient.address || "Not Provided"}
              />
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {label}
        </p>

        <p className="font-medium">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}