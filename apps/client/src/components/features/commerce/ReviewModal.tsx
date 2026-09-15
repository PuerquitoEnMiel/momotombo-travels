"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, ChatCircle, CheckCircle } from "@phosphor-icons/react";
import { Modal, Textarea, Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { reviewsService } from "@/services/reviews.service";
import { cn } from "@/lib/cn";
import { ApiException } from "@/types/api";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  onReviewAdded: () => void;
}

export function ReviewModal({ isOpen, onClose, destinationId, onReviewAdded }: ReviewModalProps) {
  const { t } = useTranslation("explore", { keyPrefix: "review" });
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError(t("errors.noAuth"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await reviewsService.create({ destinationId, rating, comment });
      setSuccess(true);
      toast.success(t("success"));
      setTimeout(() => {
        onReviewAdded();
        handleClose();
      }, 1800);
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
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} showCloseButton={!loading} size="md">
      <div className="p-6 md:p-8">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} weight="duotone" />
            </div>
            <h3 className="font-bold text-xl text-on-surface mb-2">{t("success")}</h3>
            <p className="text-on-surface-variant">{t("successHint")}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-oro-indigena/10 text-oro-indigena rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatCircle size={24} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-on-surface text-balance">{t("title")}</h2>
              <p className="text-on-surface-variant text-sm mt-1 text-pretty">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {error && (
                <div role="alert" className="bg-danger-container text-on-danger-container p-3 rounded-xl text-sm border border-danger/20">
                  {error}
                </div>
              )}

              <fieldset>
                <legend className="block text-sm font-bold text-on-surface mb-2 text-center w-full">{t("yourRating")}</legend>
                <div className="flex items-center justify-center gap-1" role="radiogroup" aria-label={t("yourRating")}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        aria-label={`${star} stars`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          weight={isActive ? "fill" : "regular"}
                          className={cn(
                            "transition-colors",
                            isActive ? "text-oro-indigena" : "text-outline"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Textarea
                label={t("tellUsMore")}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("commentPlaceholder")}
                rows={4}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={rating === 0 || !comment.trim()}
                id="btn-review-submit"
              >
                {loading ? t("success") : t("submit")}
              </Button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
