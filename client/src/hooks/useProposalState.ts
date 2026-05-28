import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  INITIAL_CONNECTIONS, INITIAL_STEPS, OUTPUT_TEMPLATES,
  ThemeConfig, Connection, AgentStep, OutputTemplate
} from '../const';

export function useProposalState() {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    template: 'editorial',
    primaryColor: '#0F1E36',
    secondaryColor: '#FBF9F6',
    headerFooterStyle: 'standard',
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
  });

  // ── Connections & Pipeline Steps ──────────────────────────────────────────
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [steps, setSteps] = useState<AgentStep[]>(INITIAL_STEPS);
  const [selectedStep, setSelectedStep] = useState<AgentStep>(INITIAL_STEPS[2]);

  // ── Pipeline Running ──────────────────────────────────────────────────────
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(60);

  // ── Style Upload ──────────────────────────────────────────────────────────
  const [uploadedStyleFile, setUploadedStyleFile] = useState<string | null>('Evans_Bundled_Final05122026.pdf');
  const [patternExtracted, setPatternExtracted] = useState(true);
  const [isExtractingPattern, setIsExtractingPattern] = useState(false);

  // ── Output Templates ──────────────────────────────────────────────────────
  const [selectedOutputTemplate, setSelectedOutputTemplate] = useState<string>('large_group');
  const [customTemplates, setCustomTemplates] = useState<OutputTemplate[]>(OUTPUT_TEMPLATES);

  // ── Slide Preview ─────────────────────────────────────────────────────────
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // ── Inline Editing ────────────────────────────────────────────────────────
  const [editableTexts, setEditableTexts] = useState<Record<string, { title?: string; subtitle?: string; body?: string }>>({});
  const [editingField, setEditingField] = useState<{ slideId: string; field: 'title' | 'subtitle' | 'body' } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const [draggedStepId, setDragStepId] = useState<number | null>(null);

  // ── Computed ──────────────────────────────────────────────────────────────
  const customStyles = useMemo(() => ({
    primaryColor: themeConfig.primaryColor,
    secondaryColor: themeConfig.secondaryColor,
    headingClass:
      themeConfig.template === 'editorial' ? 'font-editorial-heading'
      : themeConfig.template === 'swiss' ? 'font-swiss-heading'
      : 'font-modern-heading',
    bodyClass:
      themeConfig.template === 'editorial' ? 'font-editorial-body'
      : themeConfig.template === 'swiss' ? 'font-swiss-body'
      : 'font-modern-body',
  }), [themeConfig]);

  const activeTemplate = useMemo(
    () => customTemplates.find(t => t.id === selectedOutputTemplate) || customTemplates[0],
    [customTemplates, selectedOutputTemplate]
  );

  const enabledSlides = useMemo(
    () => activeTemplate.slides.filter(s => s.enabled),
    [activeTemplate]
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  const templates = [
    { id: 'editorial', name: 'Editorial Executive', desc: 'Serif fonts, parchment textures, high-end strategy feel.', heading: 'Playfair Display', body: 'Lora' },
    { id: 'swiss',    name: 'Swiss Technical Grid',  desc: 'High-contrast, clean sans-serif/mono, perfect alignment.', heading: 'Space Grotesk', body: 'JetBrains Mono' },
    { id: 'modern',   name: 'Modern Minimalist',     desc: 'Standard clean interface, elegant sans-serif, soft shadows.', heading: 'Inter', body: 'Inter' },
  ];

  const primaryColors = [
    { hex: '#0F1E36', name: 'Deep Ink Blue' },
    { hex: '#1B3A5C', name: 'Evans Navy' },
    { hex: '#000000', name: 'Pitch Black' },
    { hex: '#111827', name: 'Slate Obsidian' },
    { hex: '#1E3A8A', name: 'Corporate Blue' },
    { hex: '#312E81', name: 'Royal Indigo' },
  ];

  const secondaryColors = [
    { hex: '#FBF9F6', name: 'Warm Parchment' },
    { hex: '#FFFFFF', name: 'Pure White' },
    { hex: '#F3F4F6', name: 'Cool Gray' },
    { hex: '#F0FDFA', name: 'Mint Tint' },
    { hex: '#F5F3FF', name: 'Lavender Mist' },
  ];

  const fonts = {
    headings: ['Playfair Display', 'Space Grotesk', 'Inter', 'Georgia', 'System Sans'],
    bodies:   ['Lora', 'JetBrains Mono', 'Inter', 'Merriweather', 'System Sans'],
  };

  function handleTemplateChange(templateId: 'editorial' | 'swiss' | 'modern') {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setThemeConfig(prev => ({
        ...prev,
        template: templateId,
        headingFont: template.heading,
        bodyFont: template.body,
        primaryColor:   templateId === 'editorial' ? '#0F1E36' : templateId === 'swiss' ? '#000000' : '#1E3A8A',
        secondaryColor: templateId === 'editorial' ? '#FBF9F6' : templateId === 'swiss' ? '#FFFFFF'  : '#F3F4F6',
      }));
      toast.success(`Switched template style to ${template.name}`);
    }
  }

  function runPipeline() {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    setPipelineProgress(10);
    toast.info('Orchestrator starting end-to-end proposal pipeline...');

    const interval = setInterval(() => {
      setPipelineProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPipelineRunning(false);
          setSteps(s => s.map(step => ({ ...step, status: 'completed' })));
          toast.success('Proposal Pipeline completed! Finished PDF and PPTX stored in OneDrive.');
          return 100;
        }
        const next = prev + 15;
        if (next > 30 && next < 60) setSteps(s => s.map(step => step.id === 2 ? { ...step, status: 'completed' } : step));
        else if (next > 60 && next < 85) setSteps(s => s.map(step => step.id === 3 ? { ...step, status: 'completed' } : step));
        else if (next > 85) setSteps(s => s.map(step => step.id === 4 ? { ...step, status: 'completed' } : step));
        return next;
      });
    }, 800);
  }

  function toggleConnection(id: string) {
    setConnections(prev => prev.map(conn => {
      if (conn.id !== id) return conn;
      const nextStatus = conn.status === 'connected' ? 'disconnected' : 'connected';
      toast(`Connection ${conn.name} is now ${nextStatus}`);
      return { ...conn, status: nextStatus, lastChecked: 'Just now' };
    }));
  }

  function handleDragStart(id: number) { setDragStepId(id); }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }
  function handleDrop(id: number) {
    if (draggedStepId === null) return;
    const dragIdx = steps.findIndex(s => s.id === draggedStepId);
    const dropIdx = steps.findIndex(s => s.id === id);
    if (dragIdx !== -1 && dropIdx !== -1) {
      const newSteps = [...steps];
      const [removed] = newSteps.splice(dragIdx, 1);
      newSteps.splice(dropIdx, 0, removed);
      setSteps(newSteps.map((step, idx) => ({ ...step, id: idx + 1 })));
      toast.success('Workflow steps re-ordered successfully!');
    }
    setDragStepId(null);
  }

  function addStep() {
    const newStep: AgentStep = {
      id: steps.length + 1,
      name: `Custom Agent Step ${steps.length + 1}`,
      agentName: `AGENT ${steps.length + 1}`,
      description: 'A customized, modular sub-agent task added to the orchestrator workflow.',
      status: 'pending',
    };
    setSteps([...steps, newStep]);
    toast.success('Added new custom step to orchestrator pipeline!');
  }

  function deleteStep(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    const filtered = steps.filter(s => s.id !== id).map((s, idx) => ({ ...s, id: idx + 1 }));
    setSteps(filtered);
    if (selectedStep.id === id) setSelectedStep(filtered[0] || null);
    toast.error('Removed step from workflow');
  }

  function handleStepNameChange(id: number, newName: string) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  }

  function toggleSlide(templateId: string, slideId: string) {
    setCustomTemplates(prev => prev.map(temp =>
      temp.id !== templateId ? temp : {
        ...temp,
        slides: temp.slides.map(slide => slide.id === slideId ? { ...slide, enabled: !slide.enabled } : slide),
      }
    ));
    toast.success('Output template structure updated');
  }

  function handleUploadStyle(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setIsExtractingPattern(true);
      toast.info(`Parsing visual & structural pattern from ${fileName}...`);
      setTimeout(() => {
        setUploadedStyleFile(fileName);
        setPatternExtracted(true);
        setIsExtractingPattern(false);
        toast.success(`Successfully trained model on pattern: ${fileName}!`);
      }, 2000);
    }
  }

  function startEditing(slideId: string, field: 'title' | 'subtitle' | 'body', defaultValue: string) {
    setEditingField({ slideId, field });
    setEditValue(editableTexts[slideId]?.[field] ?? defaultValue);
  }

  function saveEditedText() {
    if (!editingField) return;
    const { slideId, field } = editingField;
    setEditableTexts(prev => ({ ...prev, [slideId]: { ...prev[slideId], [field]: editValue } }));
    setEditingField(null);
    toast.success('Slide text updated in orchestrator state!');
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEditedText();
  }

  return {
    // state
    themeConfig, setThemeConfig,
    connections, steps, selectedStep, setSelectedStep,
    isPipelineRunning, pipelineProgress,
    uploadedStyleFile, patternExtracted, isExtractingPattern,
    selectedOutputTemplate, setSelectedOutputTemplate,
    customTemplates, activeTemplate, enabledSlides,
    activeSlideIndex, setActiveSlideIndex,
    editableTexts, editingField, editValue, setEditValue,
    draggedStepId,
    // computed
    customStyles, templates, primaryColors, secondaryColors, fonts,
    // actions
    handleTemplateChange, runPipeline, toggleConnection,
    handleDragStart, handleDragOver, handleDrop,
    addStep, deleteStep, handleStepNameChange,
    toggleSlide, handleUploadStyle,
    startEditing, saveEditedText, handleKeyPress,
  };
}
