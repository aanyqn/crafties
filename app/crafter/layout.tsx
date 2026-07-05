import CrafterNavbar from "@/components/crafter/CrafterNavbar";

export default function CrafterLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950">
      <CrafterNavbar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
      
    </div>
  );
}