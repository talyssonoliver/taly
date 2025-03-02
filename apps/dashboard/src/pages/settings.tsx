import { useEffect, useState } from "react";
import EmptyLayout from "../layouts/EmptyLayout";
import { settingsService } from "../services/settingsService";
import { toast } from "react-toastify";
import { z } from "zod";
import { type Setting, SettingSchema } from "../hooks/useSettings";

export default function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.findAll();
        const validatedData = z.array(SettingSchema).parse(data);
        setSettings(validatedData);
        toast.success("Settings loaded successfully.");
      } catch (err) {
        setError("Failed to load settings.");
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <EmptyLayout title="Settings">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {loading ? (
        <p>Loading settings...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : settings.length === 0 ? (
        <p>No settings found.</p>
      ) : (
        <ul className="space-y-4">
          {settings.map((setting) => (
            <SettingCard key={setting.id} setting={setting} />
          ))}
        </ul>
      )}
    </EmptyLayout>
  );
}

interface SettingCardProps {
  setting: Setting;
}

const SettingCard: React.FC<SettingCardProps> = ({ setting }) => (
  <li className="p-4 border rounded bg-white shadow-md">
    <p className="font-semibold">{setting.name}</p>
    <p className="italic text-gray-600">ID: {setting.id}</p>
    <p>Value: {setting.value}</p>
    <p>Updated: {new Date(setting.updatedAt).toLocaleDateString()}</p>
  </li>
);
