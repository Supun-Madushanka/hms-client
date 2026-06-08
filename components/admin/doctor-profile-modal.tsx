import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Doctor } from "@/types";

interface DoctorProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
}

export function DoctorProfileModal({
  open,
  onOpenChange,
  doctor,
}: DoctorProfileModalProps) {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Dr. {doctor.name}
              </h2>

              <p className="text-muted-foreground">
                {doctor.speciality}
              </p>
            </div>

            <Badge
              variant={
                doctor.approvalStatus === "APPROVED"
                  ? "default"
                  : doctor.approvalStatus === "PENDING"
                  ? "secondary"
                  : "destructive"
              }
            >
              {doctor.approvalStatus}
            </Badge>
          </div>
        </div>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 space-y-6">

            <div>
              <h3 className="font-semibold mb-4">
                Professional Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  label="Experience"
                  value={`${doctor.experience} Years`}
                />

                <InfoCard
                  label="Speciality"
                  value={doctor.speciality}
                />

                <InfoCard
                  label="Email"
                  value={doctor.email}
                />

                {/* <InfoCard
                  label="Doctor ID"
                  value={doctor.id}
                /> */}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">
                Contact Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  label="Phone"
                  value={doctor.phone || "Not Provided"}
                />
              </div>
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
        <p className="font-medium">{value}</p>
      </CardContent>
    </Card>
  );
}