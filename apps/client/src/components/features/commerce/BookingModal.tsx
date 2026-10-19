"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Calendar, Users, CheckCircle } from "@phosphor-icons/react";
import { Modal, Input, Button, Badge } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { bookingsService } from "@/services/bookings.service";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import { MAX_GUESTS } from "@/lib/booking";
import { ApiException } from "@/types/api";

interface ActivityOption {
  id: string;
  name: string;
  price?: number;
  duration?: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityOption[];
  destinationId?: string;
  destinationName?: string;
  /** Initial values seeded from the caller (e.g. the destination page sidebar). */
  initialDate?: string;
  initialGuests?: number;
}

/** Local-timezone date as YYYY-MM-DD (toISOString() is UTC and can be off by one day). */
function localISODate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingModal({ isOpen, onClose, activities, destinationName, initialDate, initialGuests }: BookingModalProps) {
  const router = useRouter();
  const { t } = useTranslation("explore", { keyPrefix: "booking" });
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [selectedActivity, setSelectedActivity] = useState(activities[0]?.id || "");
  const [date, setDate] = useState(initialDate ?? "");
  const [guests, setGuests] = useState(initialGuests ?? 1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Re-seed the form from the caller's values whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setDate(initialDate ?? "");
    setGuests(initialGuests ?? 1);
  }, [isOpen, initialDate, initialGuests]);

  const activity = activities.find((a) => a.id === selectedActivity);
  // Activities may have no published price yet: show "A consultar" instead of
  // a fake $0 total and let the request through without a client-side total.
  const hasPrice = typeof activity?.price === "number" && activity.price > 0;
  const totalPrice = (activity?.price || 0) * guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError(t("errors.noAuth"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await bookingsService.create({
        activityId: selectedActivity,
        date,
        guests,
        totalPrice: hasPrice ? totalPrice : undefined,
      });
      if (res?.id) {
        setCreatedBookingId(res.id);
      }
      setSuccess(true);
      toast.success(t("success"));
    } catch (err) {
      const message =
        err instanceof ApiException ? err.message : err instanceof Error ? err.message : t("errors.generic");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError("");
    setDate("");
    setGuests(1);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={success ? t("success") : t("title")}
      description={!success ? (destinationName ? `${t("subtitle")} · ${destinationName}` : t("subtitle")) : t("successHint")}
      showCloseButton={!loading}
    >
      {success ? (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={32} weight="duotone" />
          </div>
          <h3 className="font-serif text-lg text-on-surface font-medium">¡Reserva Registrada!</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Tu solicitud de reserva ha sido guardada. Puedes proceder al pago seguro de inmediato o revisarla en tu perfil.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {createdBookingId && (
              <Button
                variant="primary"
                onClick={() => {
                  handleClose();
                  router.push(`/checkout/${createdBookingId}`);
                }}
                id="btn-booking-proceed-checkout"
                className="flex-1 justify-center bg-oro-indigena text-volcano-black font-mono text-xs uppercase font-bold"
              >
                Pagar Reserva
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleClose}
              id="btn-booking-success-close"
              className="flex-1 justify-center text-xs font-mono"
            >
              Cerrar
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div role="alert" className="bg-danger-container text-on-danger-container p-3 rounded-xl text-sm border border-danger/20">
              {error}
            </div>
          )}

          <fieldset>
            <legend className="block text-sm font-medium text-on-surface mb-2">{t("selectActivity")}</legend>
            {activities.length === 0 ? (
              <p className="p-4 rounded-xl border border-outline-variant bg-surface-container-low text-sm text-on-surface-variant">
                {t("noActivities")}
              </p>
            ) : (
            <div className="space-y-2">
              {activities.map((act) => {
                const isSelected = selectedActivity === act.id;
                return (
                  <label
                    key={act.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ease-out-expo",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-outline-variant hover:border-on-surface-variant"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="activity"
                        value={act.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedActivity(e.target.value)}
                        className="text-primary focus-visible:ring-primary"
                      />
                      <span className="font-medium text-on-surface text-sm">{act.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {act.price ? formatMoney(act.price) : t("priceOnRequest")}
                    </Badge>
                  </label>
                );
              })}
            </div>
            )}
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label={t("date")}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              iconLeft={<Calendar size={18} />}
              min={localISODate()}
            />
            <Input
              type="number"
              label={t("guests")}
              required
              min={1}
              max={MAX_GUESTS}
              value={guests}
              onChange={(e) => setGuests(Math.min(MAX_GUESTS, Math.max(1, parseInt(e.target.value) || 1)))}
              iconLeft={<Users size={18} />}
            />
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">{t("pricePerPerson")}</span>
              <span className="font-medium text-on-surface">
                {hasPrice ? formatMoney(activity.price as number) : t("priceOnRequest")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">{t("totalGuests")}</span>
              <span className="font-medium text-on-surface">x {guests}</span>
            </div>
            <div className="border-t border-outline-variant pt-3 flex justify-between items-center">
              <span className="font-bold text-on-surface">{t("totalToPay")}</span>
              <span className="font-bold text-2xl text-secondary">
                {hasPrice ? formatMoney(totalPrice) : t("priceOnRequest")}
              </span>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={!selectedActivity || !date || loading} id="btn-booking-submit">
            {loading ? t("submitting") : t("payButton")}
          </Button>
        </form>
      )}
    </Modal>
  );
}
