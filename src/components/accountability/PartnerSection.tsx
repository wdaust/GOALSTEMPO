import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerCard from "./PartnerCard";
import AddPartnerDialog from "./AddPartnerDialog";
import {
  getPartners,
  invitePartner,
  updatePartnerSettings,
} from "@/lib/api/partners";
import { checkSupabaseConnection } from "@/lib/supabase";

interface PartnerType {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  achievements: string[];
  lastActive: string;
  isSharing: boolean;
}

const PartnerSection = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);

        // In a real app, we would fetch partners from the database
        // For now, we'll just set an empty array since the partners table might not be populated yet
        // const partnersData = await getPartners();
        setPartners([]);
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError("Failed to load accountability partners");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleAddPartner = (data: any) => {
    const newPartner: PartnerType = {
      id: Date.now().toString(),
      name: data.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.toLowerCase().replace(/\s/g, "")}_${Date.now()}`,
      progress: 0,
      achievements: [],
      lastActive: "Just joined",
      isSharing: true,
    };

    setPartners([...partners, newPartner]);
    setShowAddDialog(false);
  };

  const handleToggleSharing = (id: string) => {
    setPartners(
      partners.map((partner) =>
        partner.id === id
          ? { ...partner, isSharing: !partner.isSharing }
          : partner,
      ),
    );
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Accountability Partners</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="rounded-full"
          size="sm"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Partner
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading partners...</span>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>You don't have any accountability partners yet.</p>
          <p className="text-sm mt-1">
            Click "Add Partner" to invite someone to be your accountability
            partner.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              avatar={partner.avatar}
              progress={partner.progress}
              achievements={partner.achievements}
              lastActive={partner.lastActive}
              isSharing={partner.isSharing}
              onToggleSharing={() => handleToggleSharing(partner.id)}
              onSendEncouragement={() =>
                console.log("Send encouragement to", partner.id)
              }
              onViewDetails={() => console.log("View details for", partner.id)}
            />
          ))}
        </div>
      )}

      <AddPartnerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddPartner={handleAddPartner}
      />
    </div>
  );
};

export default PartnerSection;
