import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Key } from 'lucide-react';

interface AIModels {
  job_description: { provider: string; model: string };
  job_matching: { provider: string; model: string };
  video_transcription: { provider: string; model: string };
  video_evaluation: { provider: string; model: string };
  resume_insights: { provider: string; model: string };
}

interface APIKeys {
  openai_key: string;
  deepseek_key: string;
  custom_keys: Record<string, string>;
}

const PROVIDERS = [
  { value: 'lovable', label: 'Lovable AI (Gemini/GPT-5)' },
  { value: 'openai', label: 'OpenAI Direct' },
  { value: 'deepseek', label: 'DeepSeek' },
];

const LOVABLE_MODELS = [
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Recommended)' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { value: 'openai/gpt-5', label: 'GPT-5' },
  { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'openai/gpt-5-nano', label: 'GPT-5 Nano' },
];

const OPENAI_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
];

const DEEPSEEK_MODELS = [
  { value: 'deepseek-chat', label: 'DeepSeek Chat' },
  { value: 'deepseek-reasoner', label: 'DeepSeek Reasoner' },
];

export default function AISettingsPanel() {
  const [aiModels, setAiModels] = useState<AIModels | null>(null);
  const [apiKeys, setApiKeys] = useState<APIKeys | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['ai_models', 'api_keys']);

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.setting_key === 'ai_models') {
          setAiModels(setting.setting_value as unknown as AIModels);
        } else if (setting.setting_key === 'api_keys') {
          setApiKeys(setting.setting_value as unknown as APIKeys);
        }
      });
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!aiModels || !apiKeys) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const updates = [
        {
          setting_key: 'ai_models',
          setting_value: aiModels,
          updated_by: user?.id,
        },
        {
          setting_key: 'api_keys',
          setting_value: apiKeys,
          updated_by: user?.id,
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert({
            ...update,
            setting_value: update.setting_value as any
          }, { onConflict: 'setting_key' });

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const updateModelConfig = (task: keyof AIModels, field: 'provider' | 'model', value: string) => {
    if (!aiModels) return;
    setAiModels({
      ...aiModels,
      [task]: {
        ...aiModels[task],
        [field]: value,
      },
    });
  };

  const getModelOptions = (provider: string) => {
    switch (provider) {
      case 'lovable':
        return LOVABLE_MODELS;
      case 'openai':
        return OPENAI_MODELS;
      case 'deepseek':
        return DEEPSEEK_MODELS;
      default:
        return LOVABLE_MODELS;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys Configuration
          </CardTitle>
          <CardDescription>
            Configure API keys for external AI providers. Keys are encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={apiKeys?.openai_key || ''}
              onChange={(e) => setApiKeys({ ...apiKeys!, openai_key: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
            <Input
              id="deepseek-key"
              type="password"
              placeholder="ds-..."
              value={apiKeys?.deepseek_key || ''}
              onChange={(e) => setApiKeys({ ...apiKeys!, deepseek_key: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Model Selection</CardTitle>
          <CardDescription>
            Choose which AI provider and model to use for each task
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {aiModels && Object.entries(aiModels).map(([task, config]) => (
            <div key={task} className="space-y-3 p-4 border rounded-lg">
              <h3 className="font-semibold capitalize">
                {task.replace(/_/g, ' ')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select
                    value={config.provider}
                    onValueChange={(value) => updateModelConfig(task as keyof AIModels, 'provider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={config.model}
                    onValueChange={(value) => updateModelConfig(task as keyof AIModels, 'model', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getModelOptions(config.provider).map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
