import { Check, Layers, Palette, Sparkle, Sliders, SlidersHorizontal, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeConfig, OutputTemplate } from '../../const';

interface OutputBuilderProps {
  themeConfig: ThemeConfig;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  customStyles: { primaryColor: string; headingClass: string };
  templates: { id: string; name: string; desc: string; heading: string; body: string }[];
  primaryColors: { hex: string; name: string }[];
  secondaryColors: { hex: string; name: string }[];
  fonts: { headings: string[]; bodies: string[] };
  customTemplates: OutputTemplate[];
  selectedOutputTemplate: string;
  setSelectedOutputTemplate: (id: string) => void;
  setActiveSlideIndex: (i: number) => void;
  activeTemplate: OutputTemplate;
  handleTemplateChange: (id: 'editorial' | 'swiss' | 'modern') => void;
  toggleSlide: (templateId: string, slideId: string) => void;
}

export default function OutputBuilder({
  themeConfig, setThemeConfig, customStyles,
  templates, primaryColors, secondaryColors, fonts,
  customTemplates, selectedOutputTemplate, setSelectedOutputTemplate,
  setActiveSlideIndex, activeTemplate,
  handleTemplateChange, toggleSlide,
}: OutputBuilderProps) {
  return (
    <Card className="shadow-sm border-border/60 bg-white/90 h-full">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" style={{ color: customStyles.primaryColor }} />
          <CardTitle className={`text-base font-bold tracking-tight ${customStyles.headingClass}`}>
            Output Builder & Style
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Configure final PDF/PPTX output structure and visual tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="output_builder" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 bg-muted/60">
            <TabsTrigger value="output_builder" className="text-xs"><Layers className="h-3.5 w-3.5" /></TabsTrigger>
            <TabsTrigger value="template"       className="text-xs"><Palette className="h-3.5 w-3.5" /></TabsTrigger>
            <TabsTrigger value="colors"         className="text-xs"><Sparkle className="h-3.5 w-3.5" /></TabsTrigger>
            <TabsTrigger value="fonts"          className="text-xs"><Sliders className="h-3.5 w-3.5" /></TabsTrigger>
          </TabsList>

          {/* Output Template Builder */}
          <TabsContent value="output_builder" className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select Output Template Style</label>
              <div className="grid grid-cols-2 gap-2">
                {customTemplates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => { setSelectedOutputTemplate(t.id); setActiveSlideIndex(0); }}
                    className={`p-2.5 rounded-lg border cursor-pointer text-left transition-all ${
                      selectedOutputTemplate === t.id
                        ? 'border-primary bg-primary/[0.02] ring-1 ring-primary/30 shadow-sm'
                        : 'border-border bg-white hover:bg-muted/10'
                    }`}
                  >
                    <div className="text-xs font-bold text-foreground truncate">{t.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-1 line-clamp-1 leading-snug">{t.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border/40 rounded-lg p-3 bg-muted/5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span className="text-xs font-bold text-foreground">Configure Slides</span>
                <Badge className="text-[10px] text-primary-foreground px-2 py-0" style={{ backgroundColor: customStyles.primaryColor }}>
                  {activeTemplate.slides.filter(s => s.enabled).length} of {activeTemplate.slides.length} Enabled
                </Badge>
              </div>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {activeTemplate.slides.map((slide) => (
                  <div
                    key={slide.id}
                    onClick={() => toggleSlide(activeTemplate.id, slide.id)}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                      slide.enabled
                        ? 'border-emerald-200 bg-emerald-50/20 text-foreground'
                        : 'border-border bg-white/60 text-muted-foreground line-through opacity-60'
                    }`}
                  >
                    <span className="text-[11px] font-medium truncate">{slide.title}</span>
                    <CheckSquare className={`h-3.5 w-3.5 ${slide.enabled ? 'text-emerald-600' : 'text-muted-foreground/30'}`} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Templates Style */}
          <TabsContent value="template" className="space-y-3 pt-1">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => handleTemplateChange(t.id as any)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  themeConfig.template === t.id
                    ? 'border-primary bg-primary/[0.02] ring-1 ring-primary/30 shadow-sm'
                    : 'border-border/50 bg-white hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: themeConfig.template === t.id ? customStyles.primaryColor : undefined }}
                  >
                    {t.name}
                  </span>
                  {themeConfig.template === t.id && <Check className="h-3.5 w-3.5" style={{ color: customStyles.primaryColor }} />}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </TabsContent>

          {/* Colors */}
          <TabsContent value="colors" className="space-y-3 pt-1">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Primary Color</label>
              <div className="grid grid-cols-2 gap-2">
                {primaryColors.map((c) => (
                  <div
                    key={c.hex}
                    onClick={() => setThemeConfig(prev => ({ ...prev, primaryColor: c.hex }))}
                    className={`flex items-center gap-1.5 p-1.5 rounded border cursor-pointer text-xs transition-all ${
                      themeConfig.primaryColor === c.hex ? 'border-foreground bg-muted font-semibold' : 'border-border bg-white hover:bg-muted/30'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                    <span className="truncate text-[10px]">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Background Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {secondaryColors.map((c) => (
                  <div
                    key={c.hex}
                    onClick={() => setThemeConfig(prev => ({ ...prev, secondaryColor: c.hex }))}
                    className={`flex items-center gap-1.5 p-1.5 rounded border cursor-pointer text-xs transition-all ${
                      themeConfig.secondaryColor === c.hex ? 'border-foreground bg-muted font-semibold' : 'border-border bg-white hover:bg-muted/30'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full shadow-inner border border-border" style={{ backgroundColor: c.hex }} />
                    <span className="truncate text-[10px]">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Fonts */}
          <TabsContent value="fonts" className="space-y-3 pt-1">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Heading Font</label>
              <div className="grid grid-cols-1 gap-1">
                {fonts.headings.slice(0, 4).map((font) => (
                  <div
                    key={font}
                    onClick={() => setThemeConfig(prev => ({ ...prev, headingFont: font }))}
                    className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs transition-all ${
                      themeConfig.headingFont === font ? 'border-foreground bg-muted font-semibold' : 'border-border bg-white hover:bg-muted/30'
                    }`}
                  >
                    <span style={{ fontFamily: font }}>{font}</span>
                    {themeConfig.headingFont === font && <Check className="h-3 w-3" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Body Font</label>
              <div className="grid grid-cols-1 gap-1">
                {fonts.bodies.slice(0, 4).map((font) => (
                  <div
                    key={font}
                    onClick={() => setThemeConfig(prev => ({ ...prev, bodyFont: font }))}
                    className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs transition-all ${
                      themeConfig.bodyFont === font ? 'border-foreground bg-muted font-semibold' : 'border-border bg-white hover:bg-muted/30'
                    }`}
                  >
                    <span style={{ fontFamily: font }}>{font}</span>
                    {themeConfig.bodyFont === font && <Check className="h-3 w-3" />}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
