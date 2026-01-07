"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Plus, Trash2, GripVertical, Table as TableIcon, 
  BarChart3, ListTodo, X, LayoutDashboard, 
  Settings, Layers, ChevronRight, Hash
} from 'lucide-react';
import {
  DndContext, DragOverlay, closestCenter, 
  PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDraggable, useDroppable
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, rectSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- 1. MOCK DATA & TYPES ---
const UI_TEMPLATES = [
  { type: 'table', label: 'Data Analytics', icon: <TableIcon size={18} />, color: 'text-blue-400' },
  { type: 'chart', label: 'Revenue Flow', icon: <BarChart3 size={18} />, color: 'text-purple-400' },
  { type: 'form', label: 'Quick Task', icon: <ListTodo size={18} />, color: 'text-emerald-400' },
];

// --- 2. SUB-COMPONENTS: REAL UI WIDGETS ---
const WidgetRenderer = ({ type }: { type: string }) => {
  if (type === 'table') return (
    <div className="space-y-3 w-full mt-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
          <span className="text-slate-400 font-medium">Inv-00{i}</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">$2,400</span>
        </div>
      ))}
    </div>
  );
  if (type === 'chart') return (
    <div className="flex items-end gap-2 h-24 w-full mt-4 px-2">
      {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
        <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
  return (
    <div className="w-full mt-4 space-y-2">
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 w-3/4" />
      </div>
      <p className="text-[10px] text-slate-500 italic">Processing data source sync...</p>
    </div>
  );
};

// --- 3. DND COMPONENTS ---
function SortableWidget({ widget }: { widget: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: widget.id,
    data: { ...widget, isNew: false }
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 50 : 1 }}
      className={`group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 min-h-[200px] flex flex-col items-start transition-all hover:border-blue-500/50 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
    >
      <div {...attributes} {...listeners} className="absolute top-5 right-5 cursor-grab p-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-white">
        <GripVertical size={16} />
      </div>
      <div className={`p-3 rounded-2xl bg-white/5 mb-4 ${UI_TEMPLATES.find(t => t.type === widget.type)?.color}`}>
        {UI_TEMPLATES.find(t => t.type === widget.type)?.icon}
      </div>
      <h3 className="text-sm font-bold text-slate-200 tracking-tight">{widget.label}</h3>
      <WidgetRenderer type={widget.type} />
    </div>
  );
}

function DraggableMenuItem({ item }: { item: any }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `menu-${item.type}`,
    data: { ...item, isNew: true }
  });

  return (
    <div
      ref={setNodeRef} {...listeners} {...attributes}
      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-blue-600/20 border border-white/5 rounded-2xl cursor-grab transition-all group"
    >
      <div className="p-2 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
      <span className="text-sm font-semibold text-slate-300">{item.label}</span>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function DynamicDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // States
  const [sidebarItems, setSidebarItems] = useState(['overview', 'analytics', 'reports']);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Handlers
  const addSidebarItem = () => {
    const name = prompt("Enter menu name:");
    if (name) setSidebarItems([...sidebarItems, name.toLowerCase().replace(/\s+/g, '-')]);
  };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over) return;

        // HAPUS: Drop ke Trash
        if (over.id === 'trash') {
        setWidgets((items) => items.filter((i) => i.id !== active.id));
        return;
        }

        // TAMBAH: Jika ditarik dari menu (isNew) ke dashboard area
        if (active.data.current?.isNew && (over.id === 'dashboard-root' || widgets.some(w => w.id === over.id))) {
        const newWidget = {
            id: `widget-${Date.now()}`,
            type: active.data.current.type,
            label: active.data.current.label,
        };
        setWidgets((prev) => [...prev, newWidget]);
        return;
        }

        // URUTKAN: Jika ditarik antar widget
        if (active.id !== over.id) {
        setWidgets((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
        }
    };

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: 'dashboard-root' });
  const { setNodeRef: setTrashRef, isOver: isOverTrash } = useDroppable({ id: 'trash' });

  function DashboardContainer({ children, id }: { children: React.ReactNode, id: string }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    
    return (
      <div
        ref={setNodeRef}
        className={`min-h-[500px] w-full border-2 border-dashed rounded-3xl p-8 transition-colors duration-200 
        ${isOver ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/20 border-slate-800'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    );
  }
  

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveItem(e.active.data.current)} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
        
        {/* SIDEBAR */}
        <aside className="w-72 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">A</div>
            <span className="font-bold tracking-tighter text-xl">ALDO.LABS</span>
          </div>

          <nav className="flex-1 space-y-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Workspace</p>
            {sidebarItems.map((item) => (
              <Link key={item} href={`/dashboard/${item}`} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${slug === item ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5 text-slate-500'}`}>
                <div className="flex items-center gap-3">
                  <Hash size={16} />
                  <span className="text-sm font-medium capitalize">{item}</span>
                </div>
                {slug === item && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
              </Link>
            ))}
            <button onClick={addSidebarItem} className="w-full mt-4 flex items-center gap-3 p-3 text-slate-600 hover:text-slate-300 transition-colors dashed border border-white/5 border-dashed rounded-xl">
              <Plus size={16} />
              <span className="text-sm font-medium">Add Page</span>
            </button>
          </nav>

          <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Aldo Devv</p>
              <p className="text-[10px] text-slate-500 uppercase">Pro Plan</p>
            </div>
            <Settings size={16} className="text-slate-600" />
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 relative overflow-y-auto bg-gradient-to-br from-[#050505] to-[#0a0a0a] p-12">
          
          {/* TRASH ZONE (Visible on Drag) */}
          {activeItem && !activeItem.isNew && (
            <div ref={setTrashRef} className={`fixed top-12 left-1/2 -translate-x-1/2 px-12 py-6 rounded-3xl border-2 border-dashed z-[100] transition-all flex items-center gap-4 ${isOverTrash ? 'bg-red-500 border-red-400 scale-110 text-white' : 'bg-slate-900/80 backdrop-blur-xl border-white/10 text-slate-500'}`}>
              <Trash2 size={24} />
              <span className="font-bold tracking-tight">DROP HERE TO DELETE</span>
            </div>
          )}

          <header className="mb-12 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-500 mb-1 text-xs font-bold uppercase tracking-widest">
                <Layers size={12} />
                <span>Dynamic View</span>
              </div>
              <h1 className="text-5xl font-black tracking-tight capitalize">{slug}</h1>
            </div>
          </header>

          {/* DROP ZONE / GRID */}
         <DashboardContainer id="dashboard-root">
                    <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
                      {widgets.map((w) => (
                        <SortableWidget key={w.id} widget={w} />
                      ))}
                    </SortableContext>
                    
                    {widgets.length === 0 && (
                      <div className="col-span-full h-32 flex items-center justify-center text-slate-700 pointer-events-none">
                        Area Dashboard Siap Menerima Komponen...
                      </div>
                    )}
                  </DashboardContainer>

          {/* FLOATING ACTION */}
          <div className="fixed bottom-12 right-12 flex flex-col items-end gap-6">
            {isMenuOpen && (
              <div className="bg-[#0f0f0f] border border-white/10 p-6 rounded-[32px] shadow-2xl w-80 space-y-4 animate-in fade-in slide-in-from-bottom-8 z-[200] backdrop-blur-2xl">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Library</h3>
                  <X size={16} className="cursor-pointer text-slate-600 hover:text-white" onClick={() => setIsMenuOpen(false)} />
                </div>
                <div className="space-y-3">
                  {UI_TEMPLATES.map((item) => <DraggableMenuItem key={item.type} item={item} />)}
                </div>
              </div>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`w-20 h-20 rounded-[28px] flex items-center justify-center shadow-2xl transition-all z-[210] group ${isMenuOpen ? 'bg-red-500 rotate-45' : 'bg-blue-600 hover:scale-110 hover:shadow-blue-500/25'}`}>
              <Plus size={36} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <DragOverlay zIndex={1000}>
            {activeItem ? (
              <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl border border-white/20 flex items-center gap-4 cursor-grabbing scale-105 transition-transform rotate-2 ring-4 ring-blue-500/20">
                {UI_TEMPLATES.find(t => t.type === activeItem.type)?.icon}
                <span className="font-bold text-white">{activeItem.label}</span>
              </div>
            ) : null}
          </DragOverlay>
        </main>
      </div>
    </DndContext>
  );
}