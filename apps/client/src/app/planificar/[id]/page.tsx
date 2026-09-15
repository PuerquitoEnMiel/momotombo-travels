"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { MapTrifold, Calendar, DotsSixVertical, CheckCircle, Clock, ShareNetwork, Download, Trash, Plus } from "@phosphor-icons/react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

dayjs.locale("es");

interface ItineraryItem {
    id: string;
    content: string;
    time?: string;
    notes?: string;
}

interface ItineraryDay {
    id: string;
    dayNumber: number;
    date: string;
    items: ItineraryItem[];
}

export default function ItineraryEditor({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Cargando...");
    const [days, setDays] = useState<ItineraryDay[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        fetch(`${API_URL}/itineraries/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setTitle(data.title);
                    setDays(data.days.map((d: any) => ({
                        id: d.id,
                        dayNumber: d.dayNumber,
                        date: d.date,
                        items: d.items.map((i: any) => ({ id: i.id, content: i.customTitle || i.activity?.name || "Actividad" }))
                    })));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceDayIndex = days.findIndex(d => d.id === source.droppableId);
        const destDayIndex = days.findIndex(d => d.id === destination.droppableId);

        const newDays = [...days];
        const sourceItems = [...newDays[sourceDayIndex].items];
        const destItems = source.droppableId === destination.droppableId ? sourceItems : [...newDays[destDayIndex].items];

        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);

        newDays[sourceDayIndex].items = sourceItems;
        if (source.droppableId !== destination.droppableId) {
            newDays[destDayIndex].items = destItems;
        }

        setDays(newDays);

        // Guardar en Backend
        const token = localStorage.getItem("authToken");
        const itemsToUpdate = [{ id: removed.id, itineraryDayId: destination.droppableId }];
        fetch(`${API_URL}/itineraries/${params.id}/items/reorder`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ items: itemsToUpdate })
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Clock size={12} /> Borrador
                                </span>
                            </div>
                            <input
                                type="text"
                                id="input-itinerary-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-serif text-3xl md:text-4xl font-bold text-gray-900 bg-transparent border-none outline-none hover:bg-gray-50 focus:bg-gray-50 rounded-lg px-2 -ml-2 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] w-full"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button id="btn-itinerary-share" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
                                <ShareNetwork size={16} /> Compartir
                            </button>
                            <button id="btn-itinerary-pdf" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-volcano-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
                                <Download size={16} /> PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Itinerary Board */}
                    <div className="flex-1">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="space-y-6">
                                {days.map((day) => (
                                    <div key={day.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg">
                                                    {day.dayNumber}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">Día {day.dayNumber}</h3>
                                                    <p className="text-xs text-gray-500 capitalize">{dayjs(day.date).format("dddd, D MMMM")}</p>
                                                </div>
                                            </div>
                                            <button id={`btn-add-activity-day-${day.id}`} className="text-gray-400 hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
                                                <Plus size={20} />
                                            </button>
                                        </div>

                                        <Droppable droppableId={day.id}>
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="min-h-[100px] space-y-3"
                                                >
                                                    {day.items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                                                                        snapshot.isDragging 
                                                                        ? "bg-white border-primary shadow-xl scale-[1.02] z-50" 
                                                                        : "bg-gray-50 border-transparent hover:border-gray-200"
                                                                    }`}
                                                                >
                                                                    <div {...provided.dragHandleProps} className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                                                        <DotsSixVertical size={18} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <h4 className="font-bold text-gray-900 text-sm">{item.content}</h4>
                                                                            {item.time && (
                                                                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                                                                                    {item.time}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]">
                                                                        <Trash size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                ))}
                            </div>
                        </DragDropContext>
                    </div>

                    {/* Sidebar map */}
                    <div className="w-full lg:w-80 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapTrifold size={18} className="text-primary" />
                                Mapa de la ruta
                            </h3>
                            <div className="w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                                {/* Simulando un mapa con una imagen de placeholder para UI */}
                                <div className="absolute inset-0 bg-blue-50/50" />
                                <MapTrifold size={32} className="text-gray-300 relative z-10" />
                                <span className="text-xs text-gray-400 font-medium absolute bottom-4">Mapa interactivo próximo</span>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button id="btn-itinerary-confirm" className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
                                    <CheckCircle size={18} />
                                    Confirmar Itinerario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
