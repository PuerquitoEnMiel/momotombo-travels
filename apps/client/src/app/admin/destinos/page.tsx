"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  PlusCircle,
  Trash,
  PencilSimple,
  Eye,
  ArrowLeft,
  MagnifyingGlass,
  CheckCircle,
  X,
  Compass,
  Star,
} from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { destinationsService } from "@/services/destinations.service";
import type { Destination } from "@/types/destination";
import { Spinner, Button, Modal, Badge } from "@/components/ui";

export default function AdminDestinationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categoryName: "Volcanes",
    priceLevel: "MEDIUM",
    lat: 12.35,
    lng: -86.15,
    imageUrl: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationsService.list();
      setDestinations(data);
    } catch {
      toast.error("Error al cargar los destinos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Partial<Destination> = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        priceLevel: formData.priceLevel as any,
        location: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
          address: "Nicaragua",
        },
      };

      await destinationsService.create(payload);
      toast.success("Destino creado exitosamente");
      setIsModalOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        categoryName: "Volcanes",
        priceLevel: "MEDIUM",
        lat: 12.35,
        lng: -86.15,
        imageUrl: "",
      });
      fetchDestinations();
    } catch {
      toast.error("No se pudo guardar el destino en la base de datos.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el destino ${name}?`)) {
      try {
        await destinationsService.delete(id);
        toast.success(`Destino ${name} eliminado`);
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      } catch {
        toast.error("Error al eliminar el destino");
      }
    }
  };

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen bg-[#141210] flex items-center justify-center pt-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141210] text-[#EDE8E3] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} /> Volver al Panel Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif text-white font-medium flex items-center gap-2">
              <Compass size={28} className="text-oro-indigena" /> Gestión Central de Destinos
            </h1>
          </div>

          <button
            id="btn-admin-new-destination"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-oro-indigena text-volcano-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-oro-indigena/90 transition-colors flex items-center gap-2 shadow-lg"
          >
            <PlusCircle size={18} weight="bold" /> Nuevo Destino
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-[#1C1A17] border border-white/10 rounded-xl p-4 mb-6 flex items-center gap-3">
          <MagnifyingGlass size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre o slug de destino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-white placeholder-stone-400 focus:outline-hidden"
          />
        </div>

        {/* Table of Destinations */}
        <div className="bg-[#1C1A17] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center">
              <Spinner size="lg" />
              <p className="text-xs font-mono text-stone-400 mt-3">Sincronizando destinos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin size={36} className="text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 text-sm">No se encontraron destinos que coincidan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#24211D] border-b border-white/10 text-stone-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Destino / Nombre</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Calificación</th>
                    <th className="px-6 py-4">Nivel Precio</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((dest) => (
                    <tr key={dest.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <MapPin size={16} className="text-oro-indigena shrink-0" />
                        <span className="text-sm">{dest.name}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-stone-400">{dest.slug}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 text-[10px] font-mono">
                          {dest.category?.name || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-mono text-oro-indigena font-bold">
                          <Star size={12} weight="fill" /> {dest.rating?.toFixed(1) || "5.0"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-stone-400">
                        {dest.priceLevel || "MEDIUM"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/explorar/${dest.slug}`}
                            target="_blank"
                            title="Ver en sitio"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            title="Eliminar"
                            onClick={() => handleDelete(dest.id, dest.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sunset-orange transition-colors"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: New Destination */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Dar de Alta Nuevo Destino"
          description="Registra un nuevo atractivo turístico en la plataforma."
        >
          <form onSubmit={handleCreateDestination} className="space-y-4 p-6 text-xs">
            <div>
              <label className="block text-stone-400 uppercase font-mono tracking-wider mb-1">
                Nombre del Destino
              </label>
              <input
                required
                type="text"
                placeholder="Ej. Volcán Cerro Negro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-oro-indigena"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase font-mono tracking-wider mb-1">
                Slug (URL identificador)
              </label>
              <input
                type="text"
                placeholder="Ej. volcan-cerro-negro"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-white focus:outline-hidden focus:border-oro-indigena"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase font-mono tracking-wider mb-1">
                Descripción Editorial
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe los atractivos, flora, fauna y singularidad del sitio..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-oro-indigena"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 uppercase font-mono tracking-wider mb-1">
                  Nivel de Precio
                </label>
                <select
                  value={formData.priceLevel}
                  onChange={(e) => setFormData({ ...formData, priceLevel: e.target.value })}
                  className="w-full bg-[#24211D] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-oro-indigena"
                >
                  <option value="LOW">LOW ($ Económico)</option>
                  <option value="MEDIUM">MEDIUM ($$ Estándar)</option>
                  <option value="HIGH">HIGH ($$$ Premium)</option>
                  <option value="LUXURY">LUXURY ($$$$ Lujo)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 uppercase font-mono tracking-wider mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-oro-indigena"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white font-mono hover:bg-white/15 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-oro-indigena text-volcano-black font-mono font-bold hover:bg-oro-indigena/90 transition-colors"
              >
                {submitting ? "Guardando..." : "Crear Destino"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
